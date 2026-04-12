import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  const Env._();

  static String get supabaseUrl => dotenv.get('SUPABASE_URL', fallback: '');
  static String get supabaseAnonKey =>
      dotenv.get('SUPABASE_ANON_KEY', fallback: '');
  static String get openRouterApiKey =>
      dotenv.get('OPENROUTER_API_KEY', fallback: '');
  static String get semanticScholarBaseUrl => dotenv.get(
    'SEMANTIC_SCHOLAR_BASE_URL',
    fallback: 'https://api.semanticscholar.org/graph/v1',
  );
  static String get arxivBaseUrl => dotenv.get(
    'ARXIV_BASE_URL',
    fallback: 'http://export.arxiv.org/api/query',
  );
  static String get redirectScheme =>
      dotenv.get('PAPERMIND_REDIRECT_SCHEME', fallback: 'papermind');
}
