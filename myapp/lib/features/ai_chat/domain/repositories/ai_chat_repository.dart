import 'package:papermind/core/models/chat_message.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';

abstract class AiChatRepository {
  Future<String> askQuestion({
    required Paper paper,
    required ResearchLevel level,
    required List<ChatMessage> messages,
    required String question,
    bool explainSelection = false,
  });

  Future<void> saveHistory({
    required String userId,
    required String paperId,
    required List<ChatMessage> messages,
  });
}
