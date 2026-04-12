import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/services/supabase_service.dart';
import 'package:papermind/features/auth/data/repositories/supabase_auth_repository.dart';
import 'package:papermind/features/auth/domain/repositories/auth_repository.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => SupabaseAuthRepository(ref.read(supabaseClientProvider)),
);

final authStateProvider = StreamProvider<User?>(
  (ref) => ref
      .read(authRepositoryProvider)
      .authStateChanges()
      .map((state) => state.session?.user),
);

final authControllerProvider =
    StateNotifierProvider<AuthController, AsyncValue<void>>(
      (ref) => AuthController(ref.read(authRepositoryProvider)),
    );

class AuthController extends StateNotifier<AsyncValue<void>> {
  AuthController(this._repository) : super(const AsyncData(null));

  final AuthRepository _repository;

  User? get currentUser => _repository.currentUser();

  Future<void> signInWithEmail({
    required String email,
    required String password,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => _repository.signInWithEmail(email: email, password: password),
    );
  }

  Future<void> signUpWithEmail({
    required String email,
    required String password,
    String? firstName,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => _repository.signUpWithEmail(
        email: email,
        password: password,
        firstName: firstName,
      ),
    );
  }

  Future<void> signInWithGoogle() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_repository.signInWithGoogle);
  }

  Future<void> signOut() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_repository.signOut);
  }
}
