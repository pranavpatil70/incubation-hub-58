import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/widgets/empty_state.dart';
import 'package:papermind/core/widgets/papermind_card.dart';
import 'package:papermind/features/home/presentation/providers/home_controller.dart';

class LibraryScreen extends ConsumerWidget {
  const LibraryScreen({required this.userId, super.key});

  final String? userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repo = ref.read(paperRepositoryProvider);
    final homeState = ref.watch(homeControllerProvider);
    final width = MediaQuery.sizeOf(context).width;
    final horizontal = width < 420 ? 14.0 : 20.0;
    final maxWidth = width > 980 ? 860.0 : 720.0;

    if (userId == null) {
      return const EmptyState(
        title: 'Sign in to use your library',
        subtitle: 'Your bookmarks and reading history appear here.',
      );
    }

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Library'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Bookmarked'),
              Tab(text: 'Read'),
              Tab(text: 'Queue'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            FutureBuilder<List<Paper>>(
              future: repo.getBookmarkedPapers(userId!),
              builder: (context, snapshot) {
                final papers = snapshot.data ?? const [];
                return _PaperList(
                  papers: papers,
                  emptyTitle: 'No bookmarks yet',
                  emptySubtitle:
                      'Save papers from Home or Reader to build your library.',
                  maxWidth: maxWidth,
                  horizontal: horizontal,
                );
              },
            ),
            FutureBuilder<List<Paper>>(
              future: repo.getReadPapers(userId!),
              builder: (context, snapshot) {
                final papers = snapshot.data ?? const [];
                return _PaperList(
                  papers: papers,
                  emptyTitle: 'No read history yet',
                  emptySubtitle:
                      'Completed papers will appear here automatically.',
                  maxWidth: maxWidth,
                  horizontal: horizontal,
                );
              },
            ),
            _PaperList(
              papers: homeState.upcoming,
              emptyTitle: 'Queue is empty',
              emptySubtitle: 'Your upcoming recommendations will appear here.',
              maxWidth: maxWidth,
              horizontal: horizontal,
            ),
          ],
        ),
      ),
    );
  }
}

class _PaperList extends StatelessWidget {
  const _PaperList({
    required this.papers,
    required this.emptyTitle,
    required this.emptySubtitle,
    required this.maxWidth,
    required this.horizontal,
  });

  final List<Paper> papers;
  final String emptyTitle;
  final String emptySubtitle;
  final double maxWidth;
  final double horizontal;

  @override
  Widget build(BuildContext context) {
    if (papers.isEmpty) {
      return EmptyState(title: emptyTitle, subtitle: emptySubtitle);
    }

    return ListView.separated(
      padding: EdgeInsets.fromLTRB(horizontal, 16, horizontal, 100),
      itemCount: papers.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final paper = papers[index];
        return Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: maxWidth),
            child: PaperMindCard(
              onTap: () => context.push('/reader', extra: paper),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    paper.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${paper.venue} • ${paper.year}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${paper.estimatedReadingMinutes} min read',
                    style: Theme.of(context).textTheme.labelMedium,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
