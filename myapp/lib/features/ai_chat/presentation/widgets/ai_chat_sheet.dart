import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/constants/app_constants.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/widgets/app_toast.dart';
import 'package:papermind/features/ai_chat/presentation/providers/ai_chat_controller.dart';

class AiChatSheet extends ConsumerStatefulWidget {
  const AiChatSheet({
    required this.userId,
    required this.paper,
    required this.level,
    this.prefilledQuestion,
    this.autoSendPrefill = false,
    this.explainSelection = false,
    super.key,
  });

  final String userId;
  final Paper paper;
  final ResearchLevel level;
  final String? prefilledQuestion;
  final bool autoSendPrefill;
  final bool explainSelection;

  @override
  ConsumerState<AiChatSheet> createState() => _AiChatSheetState();
}

class _AiChatSheetState extends ConsumerState<AiChatSheet> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _sentPrefill = false;

  @override
  void initState() {
    super.initState();
    _controller.text = widget.prefilledQuestion ?? '';

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.autoSendPrefill &&
          !_sentPrefill &&
          _controller.text.isNotEmpty) {
        _sentPrefill = true;
        _send();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty) {
      return;
    }

    _controller.clear();
    await ref
        .read(aiChatControllerProvider.notifier)
        .sendMessage(
          userId: widget.userId,
          paper: widget.paper,
          level: widget.level,
          question: text,
          explainSelection: widget.explainSelection,
        );

    if (!mounted) {
      return;
    }

    final state = ref.read(aiChatControllerProvider);
    if (state.error != null) {
      context.showAppToast(state.error!);
    }

    if (_scrollController.hasClients) {
      await _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 140,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(aiChatControllerProvider);

    return SafeArea(
      top: false,
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.78,
        minChildSize: 0.5,
        maxChildSize: 0.96,
        builder: (context, scrollController) {
          final width = MediaQuery.sizeOf(context).width;
          final maxBubbleWidth = width < 420 ? width * 0.8 : width * 0.68;

          return Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
            ),
            padding: EdgeInsets.fromLTRB(
              width < 420 ? 12 : 16,
              12,
              width < 420 ? 12 : 16,
              16,
            ),
            child: Column(
              children: [
                Container(
                  width: 54,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Theme.of(context).dividerColor,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Ask AI about this paper',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                Expanded(
                  child: state.messages.isEmpty
                      ? _SuggestedPrompts(
                          onTap: (prompt) {
                            _controller.text = prompt;
                            _send();
                          },
                        )
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.only(top: 8),
                          itemCount:
                              state.messages.length + (state.isTyping ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (state.isTyping &&
                                index == state.messages.length) {
                              return const _TypingBubble();
                            }

                            final message = state.messages[index];
                            final isUser = message.isUser;
                            return Align(
                              alignment: isUser
                                  ? Alignment.centerRight
                                  : Alignment.centerLeft,
                              child: Container(
                                constraints: BoxConstraints(
                                  maxWidth: maxBubbleWidth.clamp(220.0, 560.0),
                                ),
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: isUser
                                      ? Theme.of(context).colorScheme.primary
                                      : Theme.of(
                                          context,
                                        ).colorScheme.surfaceContainerHighest,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Text(
                                  message.content,
                                  style: TextStyle(
                                    color: isUser
                                        ? Colors.white
                                        : Theme.of(
                                            context,
                                          ).colorScheme.onSurface,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        minLines: 1,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          hintText: 'Ask a question about the paper...',
                          border: OutlineInputBorder(),
                        ),
                        onSubmitted: (_) => _send(),
                      ),
                    ),
                    const SizedBox(width: 10),
                    FilledButton(
                      onPressed: state.isTyping ? null : _send,
                      style: FilledButton.styleFrom(
                        minimumSize: const Size(52, 52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Icon(Icons.send_rounded),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _SuggestedPrompts extends StatelessWidget {
  const _SuggestedPrompts({required this.onTap});

  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(top: 8),
      children: [
        Text(
          'Suggested Questions',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: AppConstants.suggestedQuestions
              .map(
                (question) => ActionChip(
                  label: Text(question),
                  onPressed: () => onTap(question),
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}

class _TypingBubble extends StatelessWidget {
  const _TypingBubble();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (index) {
            return Container(
                  width: 6,
                  height: 6,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withValues(alpha: 0.6),
                    shape: BoxShape.circle,
                  ),
                )
                .animate(
                  onPlay: (controller) => controller.repeat(),
                  delay: Duration(milliseconds: index * 120),
                )
                .fadeIn(duration: 260.ms)
                .fadeOut(duration: 260.ms);
          }),
        ),
      ),
    );
  }
}
