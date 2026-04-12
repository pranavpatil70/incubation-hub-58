import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/features/onboarding/domain/repositories/onboarding_repository.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class OnboardingRepositoryImpl implements OnboardingRepository {
  OnboardingRepositoryImpl(this._client, this._hiveService);

  final SupabaseClient _client;
  final HiveService _hiveService;

  @override
  Future<UserProfile?> getLocalProfile(String userId) async {
    final raw = _hiveService.readJson(HiveService.profileBoxName, userId);
    if (raw == null) {
      return null;
    }
    return UserProfile.fromJson(raw);
  }

  @override
  Future<UserProfile?> fetchRemoteProfile(String userId) async {
    try {
      final response = await _client
          .from('user_profiles')
          .select()
          .eq('id', userId)
          .maybeSingle();

      if (response == null) {
        return null;
      }

      final profile = UserProfile.fromJson(response);
      await _hiveService.saveJson(
        HiveService.profileBoxName,
        userId,
        profile.toJson(),
      );
      return profile;
    } catch (_) {
      return getLocalProfile(userId);
    }
  }

  @override
  Future<void> saveProfile(UserProfile profile) async {
    await _hiveService.saveJson(
      HiveService.profileBoxName,
      profile.id,
      profile.copyWith(onboardingCompleted: true).toJson(),
    );

    await _client
        .from('user_profiles')
        .upsert(profile.copyWith(onboardingCompleted: true).toJson());
  }

  @override
  Future<bool> isOnboardingCompleted(String userId) async {
    final local = await getLocalProfile(userId);
    if (local != null && local.onboardingCompleted) {
      return true;
    }

    final remote = await fetchRemoteProfile(userId);
    return remote?.onboardingCompleted ?? false;
  }

  @override
  Future<void> setWalkthroughSeen() {
    return _hiveService.settingsBox.put('walkthrough_seen', true);
  }

  @override
  bool isWalkthroughSeen() {
    return _hiveService.settingsBox.get('walkthrough_seen', defaultValue: false)
        as bool;
  }
}
