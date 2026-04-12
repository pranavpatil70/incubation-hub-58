import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:papermind/core/widgets/app_toast.dart';
import 'package:papermind/core/widgets/papermind_button.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _firstNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLogin = true;

  String _authErrorMessage(Object? error) {
    if (error is AuthException) {
      final message = error.message.trim();
      final lower = message.toLowerCase();
      if (lower.contains('user already registered')) {
        return 'This email is already registered. Please sign in.';
      }
      if (lower.contains('invalid login credentials')) {
        return 'Invalid email or password.';
      }
      if (lower.contains('database error saving new user')) {
        return 'Account creation failed due to database setup. Apply the latest Supabase SQL and retry.';
      }
      return message;
    }

    final fallback = error?.toString().trim();
    if (fallback != null && fallback.isNotEmpty) {
      return fallback;
    }
    return 'Authentication failed. Please retry.';
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submitEmailAuth() async {
    HapticFeedback.lightImpact();

    final firstName = _firstNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (!_isLogin && firstName.isEmpty) {
      context.showAppToast('Enter your first name to create an account.');
      return;
    }

    if (email.isEmpty || password.length < 6) {
      context.showAppToast('Enter a valid email and password (min 6 chars).');
      return;
    }

    final controller = ref.read(authControllerProvider.notifier);
    if (_isLogin) {
      await controller.signInWithEmail(email: email, password: password);
    } else {
      await controller.signUpWithEmail(
        email: email,
        password: password,
        firstName: firstName,
      );
    }

    final state = ref.read(authControllerProvider);
    if (state.hasError) {
      if (mounted) {
        context.showAppToast(_authErrorMessage(state.error));
      }
      return;
    }

    if (!_isLogin && ref.read(authRepositoryProvider).currentUser() == null) {
      if (mounted) {
        context.showAppToast(
          'Account created. Please confirm your email, then sign in.',
        );
      }
      return;
    }

    await _continueAfterAuth();
  }

  Future<void> _submitGoogleAuth() async {
    HapticFeedback.lightImpact();
    await ref.read(authControllerProvider.notifier).signInWithGoogle();
    final state = ref.read(authControllerProvider);
    if (state.hasError) {
      if (mounted) {
        context.showAppToast(_authErrorMessage(state.error));
      }
      return;
    }
    await _continueAfterAuth();
  }

  Future<void> _continueAfterAuth() async {
    final user = ref.read(authRepositoryProvider).currentUser();
    if (user == null || !mounted) {
      return;
    }

    final onboardingRepository = ref.read(onboardingRepositoryProvider);
    final completed = await onboardingRepository.isOnboardingCompleted(user.id);

    if (!mounted) {
      return;
    }

    context.go(completed ? '/home' : '/onboarding');
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;
    final width = MediaQuery.sizeOf(context).width;
    final maxFormWidth = width > 980 ? 520.0 : 460.0;
    final horizontal = width < 420 ? 14.0 : 22.0;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFEFF3FF), Color(0xFFF7FFFC)],
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              left: -80,
              top: -60,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withValues(alpha: 0.11),
                ),
              ),
            ),
            Positioned(
              right: -70,
              bottom: -70,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.secondary.withValues(alpha: 0.13),
                ),
              ),
            ),
            SafeArea(
              child: Center(
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: maxFormWidth),
                  child: SingleChildScrollView(
                    padding: EdgeInsets.fromLTRB(
                      horizontal,
                      22,
                      horizontal,
                      18,
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.border),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.08),
                            blurRadius: 24,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome to PaperMind',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Your playful AI research reading companion.',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          const SizedBox(height: 24),
                          if (!_isLogin) ...[
                            TextField(
                              controller: _firstNameController,
                              textInputAction: TextInputAction.next,
                              decoration: const InputDecoration(
                                labelText: 'First Name',
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
                          TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: const InputDecoration(
                              labelText: 'Email',
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelText: 'Password',
                            ),
                          ),
                          const SizedBox(height: 16),
                          PaperMindButton(
                            label: isLoading
                                ? 'Please wait...'
                                : (_isLogin ? 'Sign In' : 'Create Account'),
                            onPressed: isLoading ? null : _submitEmailAuth,
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: isLoading ? null : _submitGoogleAuth,
                              icon: const Icon(LucideIcons.chrome),
                              label: const Text('Continue with Google'),
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(52),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextButton(
                            onPressed: isLoading
                                ? null
                                : () => setState(() {
                                    _isLogin = !_isLogin;
                                  }),
                            child: Text(
                              _isLogin
                                  ? "Don't have an account? Create one"
                                  : 'Already have an account? Sign in',
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'By continuing, you agree to the academic use policy and AI assistance disclaimer.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
