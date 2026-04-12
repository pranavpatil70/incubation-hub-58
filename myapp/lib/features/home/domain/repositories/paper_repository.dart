import 'package:papermind/core/models/paper.dart';

class StreakCheckIn {
  const StreakCheckIn({
    required this.currentStreak,
    required this.weekDots,
    required this.shouldCelebrateFirstDay,
  });

  final int currentStreak;
  final List<bool> weekDots;
  final bool shouldCelebrateFirstDay;
}

abstract class PaperRepository {
  Future<Paper?> getTodayPaper(String userId);

  Future<List<Paper>> getUpcomingPapers(String userId);

  Future<List<Paper>> getBookmarkedPapers(String userId);

  Future<List<Paper>> getReadPapers(String userId);

  Future<void> toggleBookmark({required String userId, required Paper paper});

  Future<void> markPaperRead({
    required String userId,
    required Paper paper,
    required int readDurationMinutes,
  });

  Future<StreakCheckIn> checkInAndGetStreak(String userId);
}
