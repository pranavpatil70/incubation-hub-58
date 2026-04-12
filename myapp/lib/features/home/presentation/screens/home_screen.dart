import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:papermind/core/widgets/empty_state.dart';
import 'package:papermind/core/widgets/papermind_button.dart';
import 'package:papermind/core/widgets/papermind_card.dart';
import 'package:papermind/core/widgets/papermind_shimmer.dart';
import 'package:papermind/features/home/presentation/providers/home_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';
import 'package:url_launcher/url_launcher.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({required this.userId, super.key});

  final String? userId;
  static final RegExp _canonicalArxivDoiPattern = RegExp(
    r'10\\.48550/arXiv\\.([A-Za-z0-9.-]+)',
    caseSensitive: false,
  );

  Future<void> _openReadNowInBrowser(
    BuildContext context,
    WidgetRef ref,
    Paper paper,
  ) async {
    Paper currentPaper = paper;

    final openedCurrent = await _launchBestPdfCandidate(currentPaper);
    if (openedCurrent) {
      return;
    }

    if (userId != null) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No working PDF found. Finding another paper...'),
            duration: Duration(seconds: 2),
          ),
        );
      }

      final replacement = await ref
          .read(homeControllerProvider.notifier)
          .promoteReplacementPaperWithPdf(
            userId: userId!,
            failedPaperId: currentPaper.id,
          );

      if (replacement != null) {
        currentPaper = replacement;
        final openedReplacement = await _launchBestPdfCandidate(currentPaper);
        if (openedReplacement) {
          return;
        }
      }
    }

    if (!context.mounted) {
      return;
    }

    final fallbackCandidates = _rankPdfLinks(_collectPdfLinks(currentPaper));
    final fallback = fallbackCandidates.isNotEmpty
        ? fallbackCandidates.first
        : null;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          fallback == null
              ? 'No PDF link is available right now. Pull to refresh for a new paper.'
              : 'Could not open PDF link. Copy it and open manually.',
        ),
        action: fallback == null
            ? null
            : SnackBarAction(
                label: 'Copy Link',
                onPressed: () =>
                    Clipboard.setData(ClipboardData(text: fallback)),
              ),
      ),
    );
  }

  Future<bool> _launchBestPdfCandidate(Paper paper) async {
    final candidates = _rankPdfLinks(_collectPdfLinks(paper));

    for (final candidate in candidates) {
      final uri = Uri.tryParse(candidate);
      if (uri == null) {
        continue;
      }

      final isWeb = uri.scheme == 'https' || uri.scheme == 'http';
      if (!isWeb) {
        continue;
      }

      try {
        final launched = await launchUrl(
          uri,
          mode: kIsWeb
              ? LaunchMode.platformDefault
              : LaunchMode.externalApplication,
          webOnlyWindowName: '_blank',
        );
        if (launched) {
          return true;
        }
      } catch (_) {
        // Continue trying the next candidate.
      }
    }

    return false;
  }

  List<String> _collectPdfLinks(Paper paper) {
    final links = <String>[
      if (paper.pdfUrl != null) paper.pdfUrl!,
      ...paper.pdfCandidates,
      ..._arxivCandidates(paper),
    ];

    final deduped = <String>[];
    final seen = <String>{};
    for (final link in links) {
      final normalized = link.trim();
      if (normalized.isEmpty) {
        continue;
      }
      if (seen.add(normalized)) {
        deduped.add(normalized);
      }
    }

    return deduped;
  }

  List<String> _arxivCandidates(Paper paper) {
    final arxivId = _resolveArxivId(paper);
    if (arxivId == null || arxivId.isEmpty) {
      return const [];
    }

    return [
      'https://arxiv.org/pdf/$arxivId.pdf',
      'https://export.arxiv.org/pdf/$arxivId.pdf',
    ];
  }

  String? _resolveArxivId(Paper paper) {
    final direct = paper.arxivId?.trim();
    if (direct != null && direct.isNotEmpty) {
      return direct;
    }

    for (final entry in paper.externalIds.entries) {
      if (entry.key.toLowerCase() == 'arxiv') {
        final id = entry.value.trim();
        if (id.isNotEmpty) {
          return id;
        }
      }
    }

    final doi = paper.doi?.trim();
    if (doi == null || doi.isEmpty) {
      return null;
    }

    final match = _canonicalArxivDoiPattern.firstMatch(doi);
    final extracted = match?.group(1)?.trim();
    if (extracted == null || extracted.isEmpty) {
      return null;
    }

    return extracted;
  }

  List<String> _rankPdfLinks(List<String> links) {
    final ranked = [...links];
    ranked.sort((a, b) {
      final scoreA = _pdfLinkScore(a);
      final scoreB = _pdfLinkScore(b);
      if (scoreA != scoreB) {
        return scoreB.compareTo(scoreA);
      }
      return a.length.compareTo(b.length);
    });
    return ranked;
  }

  int _pdfLinkScore(String link) {
    final value = link.toLowerCase();
    var score = 0;

    if (value.startsWith('https://')) {
      score += 50;
    } else if (value.startsWith('http://')) {
      score += 20;
    }
    if (value.contains('arxiv.org/pdf/')) {
      score += 220;
    }
    if (value.contains('export.arxiv.org/pdf/')) {
      score += 200;
    }
    if (value.endsWith('.pdf')) {
      score += 40;
    }
    if (value.contains('openaccess') || value.contains('/pdf')) {
      score += 20;
    }

    return score;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeState = ref.watch(homeControllerProvider);
    final width = MediaQuery.sizeOf(context).width;
    final horizontal = width < 420 ? 14.0 : 20.0;
    final maxContentWidth = width >= 1180 ? 1040.0 : 900.0;
    final showGridUpcoming = width >= 900;

    if (homeState.isLoading) {
      return ListView(
        padding: EdgeInsets.all(horizontal),
        children: const [
          PaperMindShimmer(height: 180),
          SizedBox(height: 16),
          PaperMindShimmer(height: 92),
          SizedBox(height: 16),
          PaperMindShimmer(height: 120),
        ],
      );
    }

    final today = homeState.todayPaper;
    if (today == null) {
      return EmptyState(
        title: 'No paper ready yet',
        subtitle: 'We are generating your daily recommendation.',
        buttonText: 'Refresh',
        onPressed: userId == null
            ? null
            : () => ref.read(homeControllerProvider.notifier).loadHome(userId!),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        if (userId != null) {
          await ref.read(homeControllerProvider.notifier).loadHome(userId!);
        }
      },
      child: ListView(
        padding: const EdgeInsets.only(bottom: 120),
        children: [
          Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: maxContentWidth),
              child: Padding(
                padding: EdgeInsets.fromLTRB(horizontal, 24, horizontal, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Header(userId: userId),
                    if (homeState.showFirstDayCelebration) ...[
                      const SizedBox(height: 14),
                      _FirstDayCelebrationCard(
                        onDismiss: () => ref
                            .read(homeControllerProvider.notifier)
                            .dismissFirstDayCelebration(),
                      ),
                    ],
                    const SizedBox(height: 16),
                    _TodayPaperCard(
                      paper: today,
                      onReadNow: () =>
                          _openReadNowInBrowser(context, ref, today),
                      onBookmark: userId == null
                          ? null
                          : () async {
                              HapticFeedback.lightImpact();
                              await ref
                                  .read(homeControllerProvider.notifier)
                                  .toggleBookmark(
                                    userId: userId!,
                                    paper: today,
                                  );
                            },
                    ),
                    const SizedBox(height: 18),
                    _StreakWidget(
                      days: homeState.streakDays,
                      streakCount: homeState.streakCount,
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Up Next',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    if (homeState.upcoming.isEmpty)
                      const EmptyState(
                        title: 'Nothing queued yet',
                        subtitle: 'More recommendations are on their way.',
                      )
                    else if (showGridUpcoming)
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: homeState.upcoming.length,
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 2.25,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                            ),
                        itemBuilder: (context, index) {
                          final paper = homeState.upcoming[index];
                          return _UpcomingPaperCard(
                            paper: paper,
                            onTap: () => context.push('/reader', extra: paper),
                          );
                        },
                      )
                    else
                      SizedBox(
                        height: 176,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: homeState.upcoming.length,
                          separatorBuilder: (_, _) => const SizedBox(width: 10),
                          itemBuilder: (context, index) {
                            final paper = homeState.upcoming[index];
                            return SizedBox(
                              width: 270,
                              child: _UpcomingPaperCard(
                                paper: paper,
                                onTap: () =>
                                    context.push('/reader', extra: paper),
                              ),
                            );
                          },
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends ConsumerWidget {
  const _Header({required this.userId});

  final String? userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder(
      future: userId == null
          ? Future.value(null)
          : ref.read(onboardingRepositoryProvider).getLocalProfile(userId!),
      builder: (context, snapshot) {
        final firstName = snapshot.data?.firstName ?? 'Researcher';

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.22),
            ),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).colorScheme.primary.withValues(alpha: 0.12),
                Theme.of(
                  context,
                ).colorScheme.secondaryContainer.withValues(alpha: 0.35),
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Good morning, $firstName',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 4),
              Text(
                'Your daily paper is ready',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        );
      },
    );
  }
}

class _TodayPaperCard extends StatelessWidget {
  const _TodayPaperCard({
    required this.paper,
    required this.onReadNow,
    required this.onBookmark,
  });

  final Paper paper;
  final VoidCallback onReadNow;
  final VoidCallback? onBookmark;

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'paper-${paper.id}',
      child: PaperMindCard(
        featured: true,
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    paper.title,
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                IconButton(
                  onPressed: onBookmark,
                  icon: Icon(
                    paper.isBookmarked
                        ? LucideIcons.bookMarked
                        : LucideIcons.bookmark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${paper.venue} • ${paper.year}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            Text(
              paper.authors.join(', '),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),
            Text(
              paper.summary ?? paper.abstract,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _pill(
                  context,
                  paper.domain,
                  Theme.of(context).colorScheme.primary,
                ),
                _pill(
                  context,
                  paper.difficulty.name.toUpperCase(),
                  _difficultyColor(paper.difficulty),
                ),
                _pill(
                  context,
                  '${paper.estimatedReadingMinutes} min',
                  Theme.of(context).colorScheme.secondary,
                ),
              ],
            ),
            const SizedBox(height: 14),
            PaperMindButton(
              label: 'Read Now',
              onPressed: onReadNow,
              icon: LucideIcons.bookOpen,
            ),
          ],
        ),
      ),
    );
  }

  Widget _pill(BuildContext context, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        border: Border.all(color: color.withValues(alpha: 0.34)),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelMedium?.copyWith(color: color),
      ),
    );
  }

  Color _difficultyColor(ResearchLevel level) {
    switch (level) {
      case ResearchLevel.beginner:
        return AppColors.beginner;
      case ResearchLevel.intermediate:
        return AppColors.intermediate;
      case ResearchLevel.expert:
        return AppColors.expert;
    }
  }
}

class _StreakWidget extends StatelessWidget {
  const _StreakWidget({required this.days, required this.streakCount});

  final List<bool> days;
  final int streakCount;

  @override
  Widget build(BuildContext context) {
    const names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    final weekly = List<bool>.generate(
      names.length,
      (index) => index < days.length ? days[index] : false,
    );
    final primary = Theme.of(context).colorScheme.primary;
    final warning = AppColors.warning;
    final inactive = Theme.of(context).colorScheme.surfaceContainerHighest;

    return PaperMindCard(
      featured: true,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final circle = constraints.maxWidth < 360 ? 24.0 : 30.0;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.local_fire_department_rounded, color: warning),
                  const SizedBox(width: 8),
                  Text(
                    'Consistency Streak',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: warning.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: warning.withValues(alpha: 0.32),
                      ),
                    ),
                    child: Text(
                      '$streakCount day${streakCount == 1 ? '' : 's'}',
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                        color: warning,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: List.generate(names.length, (index) {
                  final active = weekly[index];

                  return Expanded(
                    child:
                        Column(
                              children: [
                                AnimatedContainer(
                                  duration: 300.ms,
                                  width: circle,
                                  height: circle,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: active
                                        ? LinearGradient(
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                            colors: [warning, primary],
                                          )
                                        : null,
                                    color: active ? null : inactive,
                                    border: Border.all(
                                      color: active
                                          ? warning.withValues(alpha: 0.40)
                                          : Theme.of(context)
                                                .colorScheme
                                                .outline
                                                .withValues(alpha: 0.35),
                                    ),
                                    boxShadow: active
                                        ? [
                                            BoxShadow(
                                              color: warning.withValues(
                                                alpha: 0.30,
                                              ),
                                              blurRadius: 10,
                                              spreadRadius: 1,
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: active
                                      ? const Icon(
                                          Icons.local_fire_department_rounded,
                                          size: 14,
                                          color: Colors.white,
                                        )
                                      : null,
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  names[index],
                                  style: Theme.of(
                                    context,
                                  ).textTheme.labelMedium,
                                ),
                              ],
                            )
                            .animate()
                            .fadeIn(duration: 280.ms, delay: (index * 60).ms)
                            .scale(
                              begin: const Offset(0.88, 0.88),
                              end: const Offset(1, 1),
                              duration: 280.ms,
                              delay: (index * 60).ms,
                              curve: Curves.easeOutCubic,
                            ),
                  );
                }),
              ),
              const SizedBox(height: 10),
              Text(
                streakCount > 0
                    ? 'Keep the flame alive. You are on a $streakCount-day roll.'
                    : 'Start your streak today by reading one full paper.',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ],
          );
        },
      ),
    );
  }
}

class _FirstDayCelebrationCard extends StatelessWidget {
  const _FirstDayCelebrationCard({required this.onDismiss});

  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    final warm = AppColors.warning;
    final hot = AppColors.accent;

    return PaperMindCard(
          featured: true,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [warm, hot],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: warm.withValues(alpha: 0.34),
                          blurRadius: 14,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.local_fire_department_rounded,
                      color: Colors.white,
                    ),
                  )
                  .animate(
                    onPlay: (controller) => controller.repeat(reverse: true),
                  )
                  .scale(
                    begin: const Offset(0.94, 0.94),
                    end: const Offset(1.04, 1.04),
                    duration: 1200.ms,
                    curve: Curves.easeInOut,
                  ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Day 1 unlocked!',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'You started your reading streak. Keep going this week for a full 7-day fire chain.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 12),
                    PaperMindButton(
                      label: 'Yaaay!',
                      isExpanded: false,
                      icon: Icons.celebration_outlined,
                      onPressed: onDismiss,
                    ),
                  ],
                ),
              ),
            ],
          ),
        )
        .animate()
        .fadeIn(duration: 350.ms)
        .slideY(begin: 0.12, end: 0, duration: 350.ms, curve: Curves.easeOut);
  }
}

class _UpcomingPaperCard extends StatelessWidget {
  const _UpcomingPaperCard({required this.paper, required this.onTap});

  final Paper paper;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return PaperMindCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            paper.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            '${paper.venue} • ${paper.year}',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const Spacer(),
          Text(
            '${paper.estimatedReadingMinutes} min read',
            style: Theme.of(context).textTheme.labelMedium,
          ),
        ],
      ),
    );
  }
}
