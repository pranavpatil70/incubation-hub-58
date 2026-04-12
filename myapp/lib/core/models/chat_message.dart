enum ChatMessageRole { user, assistant, system }

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  final String id;
  final ChatMessageRole role;
  final String content;
  final DateTime createdAt;

  bool get isUser => role == ChatMessageRole.user;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'role': role.name,
      'content': content,
      'created_at': createdAt.toIso8601String(),
    };
  }

  static ChatMessage fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String? ?? '',
      role: ChatMessageRole.values.firstWhere(
        (r) => r.name == (json['role'] as String? ?? 'assistant'),
        orElse: () => ChatMessageRole.assistant,
      ),
      content: json['content'] as String? ?? '',
      createdAt:
          DateTime.tryParse(json['created_at'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}
