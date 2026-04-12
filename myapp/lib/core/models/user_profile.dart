enum ResearchLevel { beginner, intermediate, expert }

enum ReadingFrequency { daily, everyTwoDays, weekly }

class UserProfile {
  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.level,
    required this.domains,
    this.frequency = ReadingFrequency.daily,
    this.notifyTime = '08:00',
    this.streak = 0,
    this.lastStreakCheckInAt,
    this.totalRead = 0,
    this.onboardingCompleted = false,
  });

  final String id;
  final String name;
  final String email;
  final String role;
  final ResearchLevel level;
  final List<String> domains;
  final ReadingFrequency frequency;
  final String notifyTime;
  final int streak;
  final DateTime? lastStreakCheckInAt;
  final int totalRead;
  final bool onboardingCompleted;

  String get firstName {
    final split = name.trim().split(' ');
    return split.isEmpty ? '' : split.first;
  }

  UserProfile copyWith({
    String? id,
    String? name,
    String? email,
    String? role,
    ResearchLevel? level,
    List<String>? domains,
    ReadingFrequency? frequency,
    String? notifyTime,
    int? streak,
    DateTime? lastStreakCheckInAt,
    int? totalRead,
    bool? onboardingCompleted,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      level: level ?? this.level,
      domains: domains ?? this.domains,
      frequency: frequency ?? this.frequency,
      notifyTime: notifyTime ?? this.notifyTime,
      streak: streak ?? this.streak,
      lastStreakCheckInAt: lastStreakCheckInAt ?? this.lastStreakCheckInAt,
      totalRead: totalRead ?? this.totalRead,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'level': level.name,
      'domains': domains,
      'frequency': frequency.name,
      'notify_time': notifyTime,
      'streak': streak,
      'last_streak_check_in_at': lastStreakCheckInAt?.toUtc().toIso8601String(),
      'total_read': totalRead,
      'onboarding_completed': onboardingCompleted,
    };
  }

  static UserProfile fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? '',
      level: _levelFromString(json['level'] as String? ?? 'beginner'),
      domains: (json['domains'] as List<dynamic>? ?? const [])
          .map((e) => e.toString())
          .toList(),
      frequency: _frequencyFromString(json['frequency'] as String? ?? 'daily'),
      notifyTime: json['notify_time'] as String? ?? '08:00',
      streak: json['streak'] as int? ?? 0,
      lastStreakCheckInAt: DateTime.tryParse(
        json['last_streak_check_in_at']?.toString() ?? '',
      ),
      totalRead: json['total_read'] as int? ?? 0,
      onboardingCompleted: json['onboarding_completed'] as bool? ?? false,
    );
  }

  static ResearchLevel _levelFromString(String value) {
    return ResearchLevel.values.firstWhere(
      (level) => level.name == value,
      orElse: () => ResearchLevel.beginner,
    );
  }

  static ReadingFrequency _frequencyFromString(String value) {
    return ReadingFrequency.values.firstWhere(
      (freq) => freq.name == value,
      orElse: () => ReadingFrequency.daily,
    );
  }
}
