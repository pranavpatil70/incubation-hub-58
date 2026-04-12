import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/constants/app_constants.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/core/services/supabase_service.dart';
import 'package:papermind/features/onboarding/data/repositories/onboarding_repository_impl.dart';
import 'package:papermind/features/onboarding/domain/repositories/onboarding_repository.dart';

final onboardingRepositoryProvider = Provider<OnboardingRepository>(
  (ref) => OnboardingRepositoryImpl(
    ref.read(supabaseClientProvider),
    ref.read(hiveServiceProvider),
  ),
);

final onboardingControllerProvider =
    StateNotifierProvider<OnboardingController, OnboardingDraft>(
      (ref) => OnboardingController(ref.read(onboardingRepositoryProvider)),
    );

class OnboardingDraft {
  const OnboardingDraft({
    this.step = 0,
    this.role,
    this.level = ResearchLevel.beginner,
    this.domains = const [],
    this.isSaving = false,
    this.error,
  });

  final int step;
  final String? role;
  final ResearchLevel level;
  final List<String> domains;
  final bool isSaving;
  final String? error;

  bool get canGoNext {
    if (step == 0) {
      return role != null;
    }
    if (step == 2) {
      return domains.isNotEmpty;
    }
    return true;
  }

  OnboardingDraft copyWith({
    int? step,
    String? role,
    ResearchLevel? level,
    List<String>? domains,
    bool? isSaving,
    String? error,
  }) {
    return OnboardingDraft(
      step: step ?? this.step,
      role: role ?? this.role,
      level: level ?? this.level,
      domains: domains ?? this.domains,
      isSaving: isSaving ?? this.isSaving,
      error: error,
    );
  }
}

class OnboardingController extends StateNotifier<OnboardingDraft> {
  OnboardingController(this._repository) : super(const OnboardingDraft());

  final OnboardingRepository _repository;

  void setRole(String value) {
    state = state.copyWith(role: value, error: null);
  }

  void setLevel(double sliderValue) {
    final level = ResearchLevel.values[sliderValue.toInt()];
    state = state.copyWith(level: level, error: null);
  }

  void toggleDomain(String domain) {
    final current = [...state.domains];
    if (current.contains(domain)) {
      current.remove(domain);
    } else {
      current.add(domain);
    }
    state = state.copyWith(domains: current, error: null);
  }

  void nextStep() {
    if (!state.canGoNext) {
      state = state.copyWith(error: 'Please complete this step first.');
      return;
    }
    if (state.step < 2) {
      state = state.copyWith(step: state.step + 1, error: null);
    }
  }

  void previousStep() {
    if (state.step > 0) {
      state = state.copyWith(step: state.step - 1, error: null);
    }
  }

  Future<bool> saveProfile({
    required String userId,
    required String name,
    required String email,
  }) async {
    if (!state.canGoNext || state.role == null) {
      state = state.copyWith(error: 'Please complete onboarding.');
      return false;
    }

    state = state.copyWith(isSaving: true, error: null);
    try {
      final profile = UserProfile(
        id: userId,
        name: name,
        email: email,
        role: state.role!,
        level: state.level,
        domains: state.domains,
        frequency: ReadingFrequency.daily,
        notifyTime: '08:00',
        onboardingCompleted: true,
      );
      await _repository.saveProfile(profile);
      return true;
    } catch (_) {
      state = state.copyWith(error: 'Failed to save profile. Please retry.');
      return false;
    } finally {
      state = state.copyWith(isSaving: false);
    }
  }

  List<String> get availableDomains => AppConstants.domains;
}
