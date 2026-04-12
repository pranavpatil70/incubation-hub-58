import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/models/chat_message.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/services/api_client.dart';
import 'package:papermind/core/services/supabase_service.dart';
import 'package:papermind/features/ai_chat/data/repositories/ai_chat_repository_impl.dart';
import 'package:papermind/features/ai_chat/domain/repositories/ai_chat_repository.dart';

final aiChatRepositoryProvider = Provider<AiChatRepository>(
  (ref) => AiChatRepositoryImpl(
    ref.read(supabaseClientProvider),
    ref.read(dioProvider),
  ),
);

final aiChatControllerProvider =
    StateNotifierProvider<AiChatController, AiChatState>(
      (ref) => AiChatController(ref.read(aiChatRepositoryProvider)),
    );

class AiChatState {
  const AiChatState({
    this.messages = const [],
    this.isTyping = false,
    this.error,
  });

  final List<ChatMessage> messages;
  final bool isTyping;
  final String? error;

  AiChatState copyWith({
    List<ChatMessage>? messages,
    bool? isTyping,
    String? error,
  }) {
    return AiChatState(
      messages: messages ?? this.messages,
      isTyping: isTyping ?? this.isTyping,
      error: error,
    );
  }
}

class AiChatController extends StateNotifier<AiChatState> {
  AiChatController(this._repository) : super(const AiChatState());

  final AiChatRepository _repository;

  void seedSuggestedQuestion(String question) {
    state = state.copyWith(
      messages: [
        ...state.messages,
        ChatMessage(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          role: ChatMessageRole.user,
          content: question,
          createdAt: DateTime.now(),
        ),
      ],
      error: null,
    );
  }

  Future<void> sendMessage({
    required String userId,
    required Paper paper,
    required ResearchLevel level,
    required String question,
    bool explainSelection = false,
  }) async {
    final userMessage = ChatMessage(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      role: ChatMessageRole.user,
      content: question,
      createdAt: DateTime.now(),
    );

    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isTyping: true,
      error: null,
    );

    try {
      final answer = await _repository.askQuestion(
        paper: paper,
        level: level,
        messages: state.messages,
        question: question,
        explainSelection: explainSelection,
      );

      final assistantMessage = ChatMessage(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        role: ChatMessageRole.assistant,
        content: answer,
        createdAt: DateTime.now(),
      );

      final updated = [...state.messages, assistantMessage];
      state = state.copyWith(messages: updated, isTyping: false, error: null);

      await _repository.saveHistory(
        userId: userId,
        paperId: paper.id,
        messages: updated,
      );
    } catch (_) {
      state = state.copyWith(
        isTyping: false,
        error: 'AI response failed. Please retry.',
      );
    }
  }

  void clear() => state = const AiChatState();
}
