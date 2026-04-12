import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/widgets/empty_state.dart';
import 'package:papermind/core/widgets/papermind_card.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({required this.userId, super.key});

  final String? userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final width = MediaQuery.sizeOf(context).width;
    final horizontal = width < 420 ? 14.0 : 20.0;
    final maxWidth = width > 980 ? 760.0 : 680.0;

    if (userId == null) {
      return const EmptyState(
        title: 'Sign in to view profile',
        subtitle: 'Your role, stats and preferences will appear here.',
      );
    }

    final onboardingRepo = ref.read(onboardingRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            onPressed: () => context.push('/settings'),
            icon: const Icon(LucideIcons.settings),
          ),
        ],
      ),
      body: FutureBuilder<UserProfile?>(
        future: onboardingRepo.fetchRemoteProfile(userId!),
        builder: (context, snapshot) {
          final profile = snapshot.data;
          if (profile == null) {
            return const EmptyState(
              title: 'Profile not found',
              subtitle: 'Complete onboarding to initialize your profile.',
            );
          }

          return ListView(
            padding: EdgeInsets.fromLTRB(horizontal, 10, horizontal, 110),
            children: [
              Center(
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: maxWidth),
                  child: Column(
                    children: [
                      PaperMindCard(
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              child: Text(
                                profile.firstName.isEmpty
                                    ? 'P'
                                    : profile.firstName.characters.first
                                          .toUpperCase(),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    profile.name,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.titleMedium,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    profile.role,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.bodySmall,
                                  ),
                                  const SizedBox(height: 8),
                                  _levelBadge(context, profile.level),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      PaperMindCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Stats',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 10),
                            _statTile(
                              'Total papers read',
                              profile.totalRead.toString(),
                            ),
                            _statTile(
                              'Current streak',
                              '${profile.streak} days',
                            ),
                            _statTile(
                              'Favorite domain',
                              profile.domains.isEmpty
                                  ? 'N/A'
                                  : profile.domains.first,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: () async {
                            await ref
                                .read(authControllerProvider.notifier)
                                .signOut();
                            if (context.mounted) {
                              context.go('/auth');
                            }
                          },
                          icon: const Icon(LucideIcons.logOut),
                          label: const Text('Sign Out'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _levelBadge(BuildContext context, ResearchLevel level) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: Theme.of(context).colorScheme.secondary.withValues(alpha: 0.15),
      ),
      child: Text(
        level.name.toUpperCase(),
        style: Theme.of(context).textTheme.labelMedium,
      ),
    );
  }

  Widget _statTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [Text(label), Text(value)],
      ),
    );
  }
}
