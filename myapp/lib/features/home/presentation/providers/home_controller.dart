import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/services/arxiv_service.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/core/services/supabase_service.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/features/home/data/repositories/paper_repository_impl.dart';
import 'package:papermind/features/home/domain/repositories/paper_repository.dart';

final paperRepositoryProvider = Provider<PaperRepository>(
  (ref) => PaperRepositoryImpl(
    ref.read(supabaseClientProvider),
    ref.read(hiveServiceProvider),
    ref.read(arxivServiceProvider),
  ),
);

final homeControllerProvider = StateNotifierProvider<HomeController, HomeState>(
  (ref) => HomeController(ref.read(paperRepositoryProvider)),
);

class HomeState {
  const HomeState({
    this.isLoading = false,
    this.todayPaper,
    this.upcoming = const [],
    this.streakDays = const [false, false, false, false, false, false, false],
    this.streakCount = 0,
    this.showFirstDayCelebration = false,
    this.error,
  });

  final bool isLoading;
  final Paper? todayPaper;
  final List<Paper> upcoming;
  final List<bool> streakDays;
  final int streakCount;
  final bool showFirstDayCelebration;
  final String? error;

  int get currentStreak => streakCount;

  HomeState copyWith({
    bool? isLoading,
    Paper? todayPaper,
    List<Paper>? upcoming,
    List<bool>? streakDays,
    int? streakCount,
    bool? showFirstDayCelebration,
    String? error,
  }) {
    return HomeState(
      isLoading: isLoading ?? this.isLoading,
      todayPaper: todayPaper ?? this.todayPaper,
      upcoming: upcoming ?? this.upcoming,
      streakDays: streakDays ?? this.streakDays,
      streakCount: streakCount ?? this.streakCount,
      showFirstDayCelebration:
          showFirstDayCelebration ?? this.showFirstDayCelebration,
      error: error,
    );
  }
}

class HomeController extends StateNotifier<HomeState> {
  HomeController(this._repository) : super(const HomeState());

  final PaperRepository _repository;
  static final RegExp _canonicalArxivDoiPattern = RegExp(
    r'10\\.48550/arXiv\\.([A-Za-z0-9.-]+)',
    caseSensitive: false,
  );

  Future<void> loadHome(String userId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final today = await _repository.getTodayPaper(userId);
      final upNext = await _repository.getUpcomingPapers(userId);
      final streak = await _repository.checkInAndGetStreak(userId);
      state = state.copyWith(
        isLoading: false,
        todayPaper: today,
        upcoming: upNext,
        streakDays: streak.weekDots,
        streakCount: streak.currentStreak,
        showFirstDayCelebration: streak.shouldCelebrateFirstDay,
      );
    } catch (_) {
      state = state.copyWith(
        isLoading: false,
        error: 'Unable to load papers right now.',
      );
    }
  }

  void dismissFirstDayCelebration() {
    state = state.copyWith(showFirstDayCelebration: false);
  }

  Future<void> toggleBookmark({
    required String userId,
    required Paper paper,
  }) async {
    await _repository.toggleBookmark(userId: userId, paper: paper);

    if (state.todayPaper?.id == paper.id) {
      state = state.copyWith(
        todayPaper: state.todayPaper?.copyWith(
          isBookmarked: !paper.isBookmarked,
        ),
      );
    }

    final updatedUpcoming = state.upcoming
        .map(
          (item) => item.id == paper.id
              ? item.copyWith(isBookmarked: !item.isBookmarked)
              : item,
        )
        .toList();

    state = state.copyWith(upcoming: updatedUpcoming);
  }

  Future<Paper?> promoteReplacementPaperWithPdf({
    required String userId,
    required String failedPaperId,
  }) async {
    final localCandidate = _firstReadableCandidate(
      state.upcoming,
      excludePaperId: failedPaperId,
    );

    if (localCandidate != null) {
      final currentToday = state.todayPaper;
      final updatedUpcoming = state.upcoming
          .where((paper) => paper.id != localCandidate.id)
          .toList(growable: true);

      if (currentToday != null && currentToday.id != localCandidate.id) {
        updatedUpcoming.add(currentToday);
      }

      state = state.copyWith(
        todayPaper: localCandidate,
        upcoming: updatedUpcoming,
        error: null,
      );
      return localCandidate;
    }

    await loadHome(userId);

    final refreshedToday = state.todayPaper;
    if (refreshedToday != null &&
        refreshedToday.id != failedPaperId &&
        _paperHasPdfHint(refreshedToday)) {
      return refreshedToday;
    }

    final refreshedCandidate = _firstReadableCandidate(
      state.upcoming,
      excludePaperId: failedPaperId,
    );
    if (refreshedCandidate == null) {
      return null;
    }

    final currentToday = state.todayPaper;
    final updatedUpcoming = state.upcoming
        .where((paper) => paper.id != refreshedCandidate.id)
        .toList(growable: true);

    if (currentToday != null && currentToday.id != refreshedCandidate.id) {
      updatedUpcoming.add(currentToday);
    }

    state = state.copyWith(
      todayPaper: refreshedCandidate,
      upcoming: updatedUpcoming,
      error: null,
    );

    return refreshedCandidate;
  }

  Paper? _firstReadableCandidate(
    List<Paper> papers, {
    required String excludePaperId,
  }) {
    for (final paper in papers) {
      if (paper.id == excludePaperId) {
        continue;
      }
      if (_paperHasPdfHint(paper)) {
        return paper;
      }
    }
    return null;
  }

  bool _paperHasPdfHint(Paper paper) {
    final pdfUrl = paper.pdfUrl?.trim();
    if (pdfUrl != null && pdfUrl.isNotEmpty) {
      return true;
    }

    for (final candidate in paper.pdfCandidates) {
      if (candidate.trim().isNotEmpty) {
        return true;
      }
    }

    final arxivId = paper.arxivId?.trim();
    if (arxivId != null && arxivId.isNotEmpty) {
      return true;
    }

    for (final entry in paper.externalIds.entries) {
      if (entry.key.toLowerCase() == 'arxiv' && entry.value.trim().isNotEmpty) {
        return true;
      }
    }

    final doi = paper.doi?.trim();
    if (doi == null || doi.isEmpty) {
      return false;
    }

    return _canonicalArxivDoiPattern.hasMatch(doi);
  }
}
