import 'package:dio/dio.dart';
import 'package:papermind/core/config/env.dart';
import 'package:papermind/core/models/chat_message.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/features/ai_chat/domain/repositories/ai_chat_repository.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AiChatRepositoryImpl implements AiChatRepository {
  AiChatRepositoryImpl(this._client, this._dio);

  final SupabaseClient _client;
  final Dio _dio;

  @override
  Future<String> askQuestion({
    required Paper paper,
    required ResearchLevel level,
    required List<ChatMessage> messages,
    required String question,
    bool explainSelection = false,
  }) async {
    final authors = paper.authors.join(', ');
    final summary = (paper.summary ?? '').trim();
    final levelName = level.name.toUpperCase();
    final metadataContext =
        'Title: ${paper.title}\n'
        'Authors: ${authors.isEmpty ? 'Unknown' : authors}\n'
        'Venue: ${paper.venue} (${paper.year})\n'
        'Domain: ${paper.domain}\n'
        'Difficulty: ${paper.difficulty.name} (${paper.difficultyScore}/10)\n'
        'Abstract: ${paper.abstract}\n'
        'Summary: ${summary.isEmpty ? 'No summary available.' : summary}';

    final systemPrompt = explainSelection
        ? 'You are a research assistant. Explain the selected excerpt in simple terms for a ${level.name} researcher. Be concise, clear, and educational. Max 150 words. If jargon appears, define it briefly.'
        : 'You are PaperMind AI, an expert research assistant.\n'
              'User level: $levelName\n'
              'Use the paper metadata below as context.\n'
              '$metadataContext\n\n'
              'Guidelines:\n'
              '- Answer directly and avoid repeating the abstract verbatim.\n'
              '- If the user asks for details not present in the provided context, say what is missing and provide the best possible high-confidence explanation.\n'
              '- Keep explanations at the requested depth for the user level.';

    try {
      final response = await _client.functions.invoke(
        'paper-chat',
        body: {
          'paper': paper.toJson(),
          'level': level.name,
          'question': question,
          'messages': messages.map((e) => e.toJson()).toList(),
          'system_prompt': systemPrompt,
          'explain_selection': explainSelection,
        },
      );

      final data = response.data;
      if (data is Map && data['answer'] != null) {
        return data['answer'].toString();
      }
    } catch (_) {
      // Fall back to direct OpenRouter call when edge function is unavailable.
    }

    final fallbackResponse = await _dio.post(
      'https://openrouter.ai/api/v1/chat/completions',
      options: Options(
        headers: {
          'Authorization': 'Bearer ${Env.openRouterApiKey}',
          'Content-Type': 'application/json',
        },
      ),
      data: {
        'model': 'meta-llama/llama-3.1-70b-instruct',
        'messages': [
          {'role': 'system', 'content': systemPrompt},
          ...messages.map(
            (message) => {
              'role': message.role.name,
              'content': message.content,
            },
          ),
          {'role': 'user', 'content': question},
        ],
      },
    );

    final data = fallbackResponse.data as Map<String, dynamic>?;
    final choices = data?['choices'] as List<dynamic>? ?? const [];
    if (choices.isEmpty) {
      return 'I could not generate a response right now. Please try again.';
    }

    final message =
        (choices.first as Map<String, dynamic>)['message']
            as Map<String, dynamic>?;
    return message?['content']?.toString() ??
        'I could not generate a response right now. Please try again.';
  }

  @override
  Future<void> saveHistory({
    required String userId,
    required String paperId,
    required List<ChatMessage> messages,
  }) async {
    try {
      await _client.from('chat_history').insert({
        'user_id': userId,
        'paper_id': paperId,
        'messages': messages.map((e) => e.toJson()).toList(),
      });
    } catch (_) {
      // Keep chat working even when persistence fails.
    }
  }
}
