import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/widgets/app_toast.dart';
import 'package:papermind/core/widgets/papermind_button.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _next(WidgetRef ref, OnboardingDraft state) async {
    final notifier = ref.read(onboardingControllerProvider.notifier);

    if (state.step < 2) {
      notifier.nextStep();
      await _pageController.animateToPage(
        state.step + 1,
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
      return;
    }

    final user = ref.read(authRepositoryProvider).currentUser();
    if (user == null) {
      if (mounted) {
        context.showAppToast('Please sign in again.');
        context.go('/auth');
      }
      return;
    }

    final name =
        user.userMetadata?['full_name']?.toString() ??
        user.email?.split('@').first ??
        'Researcher';

    final success = await notifier.saveProfile(
      userId: user.id,
      name: name,
      email: user.email ?? '',
    );

    if (!mounted) {
      return;
    }

    if (success) {
      context.go('/home');
    } else {
      context.showAppToast('Could not save onboarding profile. Retry?');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(onboardingControllerProvider);
    final notifier = ref.read(onboardingControllerProvider.notifier);
    final width = MediaQuery.sizeOf(context).width;
    final maxWidth = width > 1080 ? 860.0 : 760.0;
    final horizontal = width < 420 ? 14.0 : 20.0;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: maxWidth),
            child: Padding(
              padding: EdgeInsets.fromLTRB(horizontal, 16, horizontal, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Set up your PaperMind profile',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Step ${state.step + 1} of 3',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(value: (state.step + 1) / 3),
                  const SizedBox(height: 20),
                  Expanded(
                    child: PageView(
                      controller: _pageController,
                      onPageChanged: (index) {
                        while (ref.read(onboardingControllerProvider).step <
                            index) {
                          notifier.nextStep();
                        }
                        while (ref.read(onboardingControllerProvider).step >
                            index) {
                          notifier.previousStep();
                        }
                      },
                      children: [
                        _RoleStep(
                          selectedRole: state.role,
                          onChanged: notifier.setRole,
                        ),
                        _LevelStep(
                          level: state.level,
                          onChanged: notifier.setLevel,
                        ),
                        _DomainStep(
                          selectedDomains: state.domains,
                          allDomains: notifier.availableDomains,
                          onToggle: notifier.toggleDomain,
                        ),
                      ],
                    ),
                  ),
                  if (state.error != null) ...[
                    Text(
                      state.error!,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],
                  Row(
                    children: [
                      if (state.step > 0)
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () async {
                              HapticFeedback.selectionClick();
                              notifier.previousStep();
                              await _pageController.previousPage(
                                duration: const Duration(milliseconds: 220),
                                curve: Curves.easeOut,
                              );
                            },
                            child: const Text('Back'),
                          ),
                        ),
                      if (state.step > 0) const SizedBox(width: 12),
                      Expanded(
                        child: PaperMindButton(
                          label: state.step == 2 ? 'Finish Setup' : 'Next',
                          onPressed: state.isSaving
                              ? null
                              : () {
                                  HapticFeedback.lightImpact();
                                  _next(ref, state);
                                },
                          isExpanded: false,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleStep extends StatelessWidget {
  const _RoleStep({required this.selectedRole, required this.onChanged});

  final String? selectedRole;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    const roles = [
      'Undergraduate Student',
      'Graduate / PhD Student',
      'Independent Researcher',
      'Professor / Industry Expert',
    ];
    final colorScheme = Theme.of(context).colorScheme;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Who are you?', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          ...roles.map(
            (role) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => onChanged(role),
                child: Ink(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selectedRole == role
                          ? colorScheme.primary
                          : colorScheme.outlineVariant,
                    ),
                    color: selectedRole == role
                        ? colorScheme.primary.withValues(alpha: 0.08)
                        : null,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 14,
                    ),
                    child: Row(
                      children: [
                        Expanded(child: Text(role)),
                        if (selectedRole == role)
                          Icon(
                            Icons.check_circle,
                            color: colorScheme.primary,
                            size: 20,
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
    );
  }
}

class _LevelStep extends StatelessWidget {
  const _LevelStep({required this.level, required this.onChanged});

  final ResearchLevel level;
  final ValueChanged<double> onChanged;

  @override
  Widget build(BuildContext context) {
    const labels = [
      'Beginner: I am just starting to read papers',
      'Intermediate: I understand most concepts but struggle with advanced theory',
      'Expert: I read papers regularly and want cutting-edge content',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'What is your research level?',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 24),
        Slider(
          value: level.index.toDouble(),
          min: 0,
          max: 2,
          divisions: 2,
          label: level.name,
          onChanged: onChanged,
        ),
        const SizedBox(height: 12),
        Text(
          labels[level.index],
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }
}

class _DomainStep extends StatelessWidget {
  const _DomainStep({
    required this.selectedDomains,
    required this.allDomains,
    required this.onToggle,
  });

  final List<String> selectedDomains;
  final List<String> allDomains;
  final ValueChanged<String> onToggle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Pick your domains',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 14),
        Expanded(
          child: SingleChildScrollView(
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: allDomains
                  .map(
                    (domain) => FilterChip(
                      label: Text(domain),
                      selected: selectedDomains.contains(domain),
                      onSelected: (_) => onToggle(domain),
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      ],
    );
  }
}
