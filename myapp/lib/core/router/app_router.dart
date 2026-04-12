import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/features/auth/presentation/screens/auth_screen.dart';
import 'package:papermind/features/home/presentation/screens/home_shell_screen.dart';
import 'package:papermind/features/onboarding/presentation/screens/onboarding_screen.dart';
import 'package:papermind/features/reader/presentation/screens/reader_screen.dart';
import 'package:papermind/features/settings/presentation/screens/settings_screen.dart';
import 'package:papermind/features/splash/presentation/screens/splash_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(path: '/auth', builder: (context, state) => const AuthScreen()),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeShellScreen(),
      ),
      GoRoute(
        path: '/reader',
        builder: (context, state) {
          final extra = state.extra;
          if (extra is! Paper) {
            return Scaffold(
              appBar: AppBar(title: const Text('Reader')),
              body: const Center(child: Text('Paper payload missing.')),
            );
          }
          return ReaderScreen(paper: extra);
        },
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});
