import 'package:supabase_flutter/supabase_flutter.dart';

abstract class AuthRepository {
  Stream<AuthState> authStateChanges();

  User? currentUser();

  Future<void> signInWithEmail({
    required String email,
    required String password,
  });

  Future<void> signUpWithEmail({
    required String email,
    required String password,
    String? firstName,
  });

  Future<void> signInWithGoogle();

  Future<void> signOut();
}
