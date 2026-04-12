import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:papermind/core/constants/app_constants.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await Future<void>.delayed(const Duration(seconds: 2));

    final authRepository = ref.read(authRepositoryProvider);
    final onboardingRepository = ref.read(onboardingRepositoryProvider);
    final user = authRepository.currentUser();

    if (!mounted) {
      return;
    }

    if (user == null) {
      context.go('/auth');
      return;
    }

    final completed = await onboardingRepository.isOnboardingCompleted(user.id);

    if (!mounted) {
      return;
    }

    context.go(completed ? '/home' : '/onboarding');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFEAF0FF), Color(0xFFF4FFFC)],
          ),
        ),
        child: Center(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final iconSize = constraints.maxWidth < 420 ? 62.0 : 76.0;

              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                        Icons.auto_stories_rounded,
                        color: AppColors.primary,
                        size: iconSize,
                      )
                      .animate(
                        onPlay: (controller) =>
                            controller.repeat(reverse: true),
                      )
                      .fade(duration: 650.ms)
                      .scale(
                        begin: const Offset(0.92, 0.92),
                        end: const Offset(1, 1),
                      ),
                  const SizedBox(height: 16),
                  Text(
                    AppConstants.appName,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Your playful AI reading studio',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
