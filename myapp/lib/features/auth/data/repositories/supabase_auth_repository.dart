import 'package:papermind/core/config/env.dart';
import 'package:papermind/features/auth/domain/repositories/auth_repository.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseAuthRepository implements AuthRepository {
  SupabaseAuthRepository(this._client);

  final SupabaseClient _client;

  @override
  Stream<AuthState> authStateChanges() => _client.auth.onAuthStateChange;

  @override
  User? currentUser() => _client.auth.currentUser;

  @override
  Future<void> signInWithEmail({
    required String email,
    required String password,
  }) async {
    await _client.auth.signInWithPassword(email: email, password: password);
  }

  @override
  Future<void> signUpWithEmail({
    required String email,
    required String password,
    String? firstName,
  }) async {
    final trimmedFirstName = firstName?.trim();
    await _client.auth.signUp(
      email: email,
      password: password,
      data: trimmedFirstName == null || trimmedFirstName.isEmpty
          ? null
          : {'name': trimmedFirstName},
    );
  }

  @override
  Future<void> signInWithGoogle() async {
    await _client.auth.signInWithOAuth(
      OAuthProvider.google,
      redirectTo: '${Env.redirectScheme}://auth-callback/',
    );
  }

  @override
  Future<void> signOut() => _client.auth.signOut();
}
