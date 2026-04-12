import 'package:papermind/core/models/user_profile.dart';

abstract class OnboardingRepository {
  Future<UserProfile?> getLocalProfile(String userId);

  Future<UserProfile?> fetchRemoteProfile(String userId);

  Future<void> saveProfile(UserProfile profile);

  Future<bool> isOnboardingCompleted(String userId);

  Future<void> setWalkthroughSeen();

  bool isWalkthroughSeen();
}
