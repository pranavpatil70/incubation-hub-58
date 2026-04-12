import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/services/arxiv_service.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/features/home/domain/repositories/paper_repository.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PaperRepositoryImpl implements PaperRepository {
  PaperRepositoryImpl(
    this._supabaseClient,
    this._hiveService,
    this._arxivService,
  );

  final SupabaseClient _supabaseClient;
  final HiveService _hiveService;
  final ArxivService _arxivService;

  @override
  Future<Paper?> getTodayPaper(String userId) async {
    try {
      final todayDate = _todayUtcDateString();

      final scheduled = await _getScheduledPaperForDate(
        userId: userId,
        date: todayDate,
      );
      if (scheduled != null) {
        await _cachePaper(scheduled);
        return scheduled;
      }

      await _requestTodayRecommendation(userId);

      final scheduledAfterGeneration = await _getScheduledPaperForDate(
        userId: userId,
        date: todayDate,
      );
      if (scheduledAfterGeneration != null) {
        await _cachePaper(scheduledAfterGeneration);
        return scheduledAfterGeneration;
      }

      final levelFallback = await _getBestLevelMatchedPaper(userId);
      if (levelFallback != null) {
        await _cachePaper(levelFallback);
        return levelFallback;
      }
    } catch (_) {
      // Fall back to cached/sample paper when backend is empty or unavailable.
    }

    final cached = _readCachedPapers();
    if (cached.isNotEmpty) {
      return cached.first;
    }

    final sample = _samplePaper();
    await _cachePaper(sample);
    return sample;
  }

  @override
  Future<List<Paper>> getUpcomingPapers(String userId) async {
    try {
      final todayDate = _todayUtcDateString();
      final rows = await _supabaseClient
          .from('user_daily_papers')
          .select('scheduled_date,papers(*)')
          .eq('user_id', userId)
          .gt('scheduled_date', todayDate)
          .order('scheduled_date', ascending: true)
          .limit(3);

      if (rows.isNotEmpty) {
        final papers = <Paper>[];
        for (final row in rows) {
          final map = (row as Map).cast<String, dynamic>();
          final paperMap = map['papers'];
          if (paperMap is Map) {
            final paper = await _hydratePaper(
              paperMap.cast<String, dynamic>(),
              allowArxivLookup: true,
            );
            papers.add(paper);
          }
        }
        if (papers.isNotEmpty) {
          for (final paper in papers) {
            await _cachePaper(paper);
          }
          return papers;
        }
      }

      final level = await _readUserLevel(userId);
      final levelRows = await _supabaseClient
          .from('papers')
          .select()
          .eq('difficulty', level)
          .order('citation_count', ascending: false)
          .limit(3);

      if (levelRows.isNotEmpty) {
        final papers = <Paper>[];
        for (final row in levelRows) {
          final paper = await _hydratePaper(
            (row as Map).cast<String, dynamic>(),
            allowArxivLookup: true,
          );
          papers.add(paper);
        }
        if (papers.isNotEmpty) {
          for (final paper in papers) {
            await _cachePaper(paper);
          }
          return papers;
        }
      }
    } catch (_) {
      // Graceful fallback below.
    }

    final cached = _readCachedPapers();
    if (cached.length >= 3) {
      return cached.take(3).toList();
    }

    return [
      _samplePaper().copyWith(id: 'sample_up_1', year: DateTime.now().year),
      _samplePaper().copyWith(id: 'sample_up_2', year: DateTime.now().year - 1),
      _samplePaper().copyWith(id: 'sample_up_3', year: DateTime.now().year - 2),
    ];
  }

  @override
  Future<List<Paper>> getBookmarkedPapers(String userId) async {
    try {
      final rows = await _supabaseClient
          .from('bookmarks')
          .select('paper_id,papers(*)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      if (rows.isNotEmpty) {
        final papers = <Paper>[];
        for (final row in rows) {
          final paperMap = (row as Map)['papers'];
          if (paperMap is Map) {
            papers.add(
              await _hydratePaper(
                paperMap.cast<String, dynamic>(),
                allowArxivLookup: true,
              ),
            );
          }
        }
        return papers;
      }
    } catch (_) {
      // local fallback
    }

    return _readCachedPapers().where((paper) => paper.isBookmarked).toList();
  }

  @override
  Future<List<Paper>> getReadPapers(String userId) async {
    try {
      final rows = await _supabaseClient
          .from('user_daily_papers')
          .select('read,papers(*)')
          .eq('user_id', userId)
          .eq('read', true)
          .order('read_at', ascending: false);

      if (rows.isNotEmpty) {
        final papers = <Paper>[];
        for (final row in rows) {
          final paperMap = (row as Map)['papers'];
          if (paperMap is Map) {
            papers.add(
              await _hydratePaper(
                paperMap.cast<String, dynamic>(),
                allowArxivLookup: true,
              ),
            );
          }
        }
        return papers;
      }
    } catch (_) {
      // local fallback
    }

    return _readCachedPapers();
  }

  @override
  Future<void> toggleBookmark({
    required String userId,
    required Paper paper,
  }) async {
    try {
      if (paper.isBookmarked) {
        await _supabaseClient
            .from('bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('paper_id', paper.id);
      } else {
        await _supabaseClient.from('bookmarks').insert({
          'user_id': userId,
          'paper_id': paper.id,
        });
      }
    } catch (_) {
      // Keep local state updated even if remote write fails.
    }

    await _cachePaper(paper.copyWith(isBookmarked: !paper.isBookmarked));
  }

  @override
  Future<void> markPaperRead({
    required String userId,
    required Paper paper,
    required int readDurationMinutes,
  }) async {
    try {
      await _supabaseClient.from('user_daily_papers').upsert({
        'user_id': userId,
        'paper_id': paper.id,
        'read': true,
        'read_at': DateTime.now().toIso8601String(),
        'read_duration_minutes': readDurationMinutes,
      });
    } catch (_) {
      // local fallback only
    }

    await _cachePaper(paper);
  }

  @override
  Future<StreakCheckIn> checkInAndGetStreak(String userId) async {
    final today = _dateOnly(DateTime.now().toLocal());

    try {
      final profile = await _supabaseClient
          .from('user_profiles')
          .select('streak,last_streak_check_in_at')
          .eq('id', userId)
          .maybeSingle();

      var streak = (profile?['streak'] as int?) ?? 0;
      final rawLast = profile?['last_streak_check_in_at']?.toString();
      final parsedLast = rawLast == null ? null : DateTime.tryParse(rawLast);
      final lastCheckIn = parsedLast == null
          ? null
          : _dateOnly(parsedLast.toLocal());

      var shouldCelebrateFirstDay = false;
      var shouldPersist = false;

      if (lastCheckIn == null) {
        streak = streak <= 0 ? 1 : streak;
        shouldPersist = true;
        shouldCelebrateFirstDay = streak == 1;
      } else {
        final dayDiff = today.difference(lastCheckIn).inDays;
        if (dayDiff >= 1) {
          streak = dayDiff == 1 ? (streak <= 0 ? 1 : streak + 1) : 1;
          shouldPersist = true;
          shouldCelebrateFirstDay = streak == 1;
        } else if (streak <= 0) {
          streak = 1;
          shouldPersist = true;
          shouldCelebrateFirstDay = true;
        }
      }

      if (shouldPersist) {
        await _persistStreakCheckIn(
          userId: userId,
          streak: streak,
          checkInDate: today,
        );
      }

      final anchorDate = shouldPersist ? today : (lastCheckIn ?? today);
      return StreakCheckIn(
        currentStreak: streak,
        weekDots: _buildWeekDots(streak: streak, anchorDate: anchorDate),
        shouldCelebrateFirstDay: shouldCelebrateFirstDay,
      );
    } catch (_) {
      final localProfileRaw = _hiveService.readJson(
        HiveService.profileBoxName,
        userId,
      );
      if (localProfileRaw != null) {
        final localProfile = UserProfile.fromJson(localProfileRaw);
        final localAnchor = localProfile.lastStreakCheckInAt == null
            ? today
            : _dateOnly(localProfile.lastStreakCheckInAt!.toLocal());
        return StreakCheckIn(
          currentStreak: localProfile.streak,
          weekDots: _buildWeekDots(
            streak: localProfile.streak,
            anchorDate: localAnchor,
          ),
          shouldCelebrateFirstDay: false,
        );
      }

      return StreakCheckIn(
        currentStreak: 0,
        weekDots: const [false, false, false, false, false, false, false],
        shouldCelebrateFirstDay: false,
      );
    }
  }

  Future<void> _cachePaper(Paper paper) async {
    final cached = _readCachedPapers();

    final without = cached
        .where((existing) => existing.id != paper.id)
        .toList();
    final next = [paper, ...without].take(5).map((e) => e.toJson()).toList();

    await _hiveService.saveList(
      HiveService.cacheBoxName,
      'cached_papers',
      next,
    );
  }

  Future<void> _persistStreakCheckIn({
    required String userId,
    required int streak,
    required DateTime checkInDate,
  }) async {
    final isoDate = DateTime.utc(
      checkInDate.year,
      checkInDate.month,
      checkInDate.day,
    ).toIso8601String();

    await _supabaseClient
        .from('user_profiles')
        .update({
          'streak': streak,
          'last_streak_check_in_at': isoDate,
          'updated_at': DateTime.now().toUtc().toIso8601String(),
        })
        .eq('id', userId);

    final localProfile = _hiveService.readJson(
      HiveService.profileBoxName,
      userId,
    );
    if (localProfile == null) {
      return;
    }

    localProfile['streak'] = streak;
    localProfile['last_streak_check_in_at'] = isoDate;
    await _hiveService.saveJson(
      HiveService.profileBoxName,
      userId,
      localProfile,
    );
  }

  DateTime _dateOnly(DateTime source) {
    return DateTime(source.year, source.month, source.day);
  }

  List<bool> _buildWeekDots({
    required int streak,
    required DateTime anchorDate,
  }) {
    final dots = List<bool>.filled(7, false);
    final normalizedStreak = streak < 0 ? 0 : streak;
    final weekStart = anchorDate.subtract(
      Duration(days: anchorDate.weekday - DateTime.monday),
    );

    for (var i = 0; i < normalizedStreak; i++) {
      final date = anchorDate.subtract(Duration(days: i));
      if (date.isBefore(weekStart)) {
        break;
      }
      final index = date.weekday - DateTime.monday;
      if (index >= 0 && index < dots.length) {
        dots[index] = true;
      }
    }

    return dots;
  }

  List<Paper> _readCachedPapers() {
    final raw = _hiveService.readList(
      HiveService.cacheBoxName,
      'cached_papers',
    );
    return raw
        .whereType<Map>()
        .map((e) => Paper.fromJson(e.cast<String, dynamic>()))
        .toList();
  }

  Future<Paper?> _getScheduledPaperForDate({
    required String userId,
    required String date,
  }) async {
    final dynamic row = await _supabaseClient
        .from('user_daily_papers')
        .select('paper_id,papers(*)')
        .eq('user_id', userId)
        .eq('scheduled_date', date)
        .maybeSingle();

    if (row == null || row is! Map) {
      return null;
    }

    final map = Map<String, dynamic>.from(row);
    final paperMap = map['papers'];
    if (paperMap is Map) {
      return _hydratePaper(
        paperMap.cast<String, dynamic>(),
        allowArxivLookup: true,
      );
    }

    final paperId = map['paper_id']?.toString();
    if (paperId == null || paperId.trim().isEmpty) {
      return null;
    }

    final dynamic fallbackRow = await _supabaseClient
        .from('papers')
        .select()
        .eq('id', paperId)
        .maybeSingle();
    if (fallbackRow == null || fallbackRow is! Map) {
      return null;
    }

    return _hydratePaper(
      Map<String, dynamic>.from(fallbackRow),
      allowArxivLookup: true,
    );
  }

  Future<void> _requestTodayRecommendation(String userId) async {
    final profile = await _readUserProfileConfig(userId);
    final level = profile.$1;
    final domains = profile.$2;

    await _supabaseClient.functions.invoke(
      'paper-recommendations',
      body: {'userId': userId, 'domains': domains, 'level': level},
    );
  }

  Future<Paper?> _getBestLevelMatchedPaper(String userId) async {
    final level = await _readUserLevel(userId);

    final levelRows = await _supabaseClient
        .from('papers')
        .select()
        .eq('difficulty', level)
        .order('year', ascending: false)
        .limit(10);

    final candidates = <Paper>[];
    for (final row in levelRows) {
      candidates.add(
        await _hydratePaper(
          (row as Map).cast<String, dynamic>(),
          allowArxivLookup: true,
        ),
      );
    }

    Paper? readable;
    for (final paper in candidates) {
      if ((paper.pdfUrl?.trim().isNotEmpty ?? false) ||
          paper.pdfCandidates.isNotEmpty) {
        readable = paper;
        break;
      }
    }
    if (readable != null) {
      return readable;
    }
    if (candidates.isNotEmpty) {
      return candidates.first;
    }

    final generalRows = await _supabaseClient
        .from('papers')
        .select()
        .order('year', ascending: false)
        .limit(10);
    if (generalRows.isEmpty) {
      return null;
    }

    final generalCandidates = <Paper>[];
    for (final row in generalRows) {
      generalCandidates.add(
        await _hydratePaper(
          (row as Map).cast<String, dynamic>(),
          allowArxivLookup: true,
        ),
      );
    }

    for (final paper in generalCandidates) {
      if ((paper.pdfUrl?.trim().isNotEmpty ?? false) ||
          paper.pdfCandidates.isNotEmpty) {
        return paper;
      }
    }

    return generalCandidates.isNotEmpty ? generalCandidates.first : null;
  }

  Future<String> _readUserLevel(String userId) async {
    final profile = await _readUserProfileConfig(userId);
    return profile.$1;
  }

  Future<(String, List<String>)> _readUserProfileConfig(String userId) async {
    final dynamic row = await _supabaseClient
        .from('user_profiles')
        .select('level,domains')
        .eq('id', userId)
        .maybeSingle();

    if (row == null || row is! Map) {
      return ('intermediate', const <String>[]);
    }

    final map = Map<String, dynamic>.from(row);
    final level = map['level']?.toString().trim();
    final normalizedLevel = (level == null || level.isEmpty)
        ? 'intermediate'
        : level;

    final rawDomains = map['domains'];
    final domains = rawDomains is List
        ? rawDomains
              .map((e) => e.toString().trim())
              .where((e) => e.isNotEmpty)
              .toList()
        : const <String>[];

    return (normalizedLevel, domains);
  }

  String _todayUtcDateString() {
    return DateTime.now().toUtc().toIso8601String().split('T').first;
  }

  Future<Paper> _hydratePaper(
    Map<String, dynamic> raw, {
    required bool allowArxivLookup,
  }) async {
    final seeded = Paper.fromJson(raw);
    final externalIds = _extractExternalIds(
      raw['external_ids'] ?? raw['externalIds'] ?? seeded.externalIds,
    );
    final externalArxivId = _arxivService.extractArxivId(
      _externalIdByKey(externalIds, 'ArXiv'),
    );
    final resolvedDoi =
        seeded.doi ??
        raw['doi']?.toString() ??
        _externalIdByKey(externalIds, 'DOI');
    final doiArxivId = _arxivService.extractArxivIdFromCanonicalDoi(
      resolvedDoi,
    );

    final extraCandidates = _extractCandidateUrls(raw);
    var resolvedArxivId =
        externalArxivId ??
        _arxivService.extractArxivId(raw['arxiv_id']?.toString()) ??
        _arxivService.extractArxivId(seeded.arxivId) ??
        doiArxivId ??
        _arxivService.extractArxivId(seeded.pdfUrl) ??
        _arxivService.extractArxivId(seeded.semanticScholarId);
    ArxivLookupResult? lookup;

    if (allowArxivLookup &&
        resolvedArxivId == null &&
        seeded.title.trim().isNotEmpty) {
      lookup = await _arxivService.lookupByTitle(seeded.title);
      resolvedArxivId = lookup?.arxivId;
    }

    final preferredPrimaryPdf = resolvedArxivId == null
        ? seeded.pdfUrl
        : 'https://arxiv.org/pdf/$resolvedArxivId.pdf';

    final candidates = _arxivService.buildPdfCandidates(
      primaryPdfUrl: preferredPrimaryPdf,
      arxivId: resolvedArxivId,
      extra: [
        ...seeded.pdfCandidates,
        ...extraCandidates,
        if (lookup != null) lookup.pdfUrl,
      ],
    );

    final rankedCandidates = _rankPdfCandidates(candidates);
    final bestPdfUrl = rankedCandidates.isNotEmpty
        ? rankedCandidates.first
        : seeded.pdfUrl;

    return seeded.copyWith(
      pdfUrl: bestPdfUrl,
      arxivId: resolvedArxivId,
      externalIds: externalIds.isNotEmpty ? externalIds : seeded.externalIds,
      doi: resolvedDoi,
      pdfCandidates: rankedCandidates,
    );
  }

  List<String> _extractCandidateUrls(Map<String, dynamic> raw) {
    final candidates = <String>[];
    final externalIds = _extractExternalIds(
      raw['external_ids'] ?? raw['externalIds'],
    );

    final externalArxivId = _arxivService.extractArxivId(
      _externalIdByKey(externalIds, 'ArXiv'),
    );
    if (externalArxivId != null) {
      candidates.add('https://arxiv.org/pdf/$externalArxivId.pdf');
    }

    final doi = raw['doi']?.toString() ?? _externalIdByKey(externalIds, 'DOI');
    final doiArxivId = _arxivService.extractArxivIdFromCanonicalDoi(doi);
    if (doiArxivId != null) {
      candidates.add('https://arxiv.org/pdf/$doiArxivId.pdf');
    }

    final direct = raw['pdf_url']?.toString();
    if (direct != null && direct.trim().isNotEmpty) {
      candidates.add(direct);
    }

    final openAccess = raw['open_access_pdf'];
    if (openAccess is Map) {
      final url = openAccess['url']?.toString();
      if (url != null && url.trim().isNotEmpty) {
        candidates.add(url);
      }
    }

    final links = raw['pdf_candidates'];
    if (links is List) {
      candidates.addAll(
        links.map((e) => e.toString()).where((e) => e.trim().isNotEmpty),
      );
    }

    return candidates;
  }

  Map<String, String> _extractExternalIds(dynamic source) {
    if (source is! Map) {
      return const {};
    }

    final values = <String, String>{};
    source.forEach((key, value) {
      final normalizedKey = key.toString().trim();
      final normalizedValue = value?.toString().trim() ?? '';
      if (normalizedKey.isNotEmpty && normalizedValue.isNotEmpty) {
        values[normalizedKey] = normalizedValue;
      }
    });

    return values;
  }

  String? _externalIdByKey(Map<String, String> externalIds, String key) {
    for (final entry in externalIds.entries) {
      if (entry.key.toLowerCase() == key.toLowerCase()) {
        return entry.value;
      }
    }
    return null;
  }

  List<String> _rankPdfCandidates(List<String> candidates) {
    final unique = <String>{
      ...candidates.map((e) => e.trim()).where((e) => e.isNotEmpty),
    }.toList(growable: false);

    final ranked = [...unique];
    ranked.sort((a, b) {
      final scoreA = _pdfLinkScore(a);
      final scoreB = _pdfLinkScore(b);
      if (scoreA != scoreB) {
        return scoreB.compareTo(scoreA);
      }
      return a.length.compareTo(b.length);
    });

    return ranked;
  }

  int _pdfLinkScore(String url) {
    final normalized = url.toLowerCase();
    var score = 0;

    if (normalized.startsWith('https://')) {
      score += 50;
    } else if (normalized.startsWith('http://')) {
      score += 20;
    }

    if (normalized.contains('arxiv.org/pdf/')) {
      score += 220;
    }
    if (normalized.contains('export.arxiv.org/pdf/')) {
      score += 200;
    }
    if (normalized.endsWith('.pdf')) {
      score += 40;
    }
    if (normalized.contains('openaccess') || normalized.contains('/pdf')) {
      score += 20;
    }

    return score;
  }

  Paper _samplePaper() {
    const abstract =
        'Transformers have become central to modern machine learning research. '
        'This paper provides a practical roadmap for efficient training, robust '
        'evaluation, and deployment patterns in academic and production settings.';

    return const Paper(
      id: 'sample_today',
      title: 'Efficient Transformer Research Workflows for Daily Reading',
      authors: ['A. Scholar', 'P. Researcher', 'D. Student'],
      abstract: abstract,
      year: 2026,
      venue: 'PaperMind Journal Club',
      domain: 'Machine Learning',
      difficulty: ResearchLevel.intermediate,
      difficultyScore: 6,
      semanticScholarId: 'sample_today',
      citationCount: 142,
      summary:
          'A practical guide to reading and evaluating transformer papers with structured methodology and fast iteration loops.',
      wordCount: 540,
    );
  }
}
