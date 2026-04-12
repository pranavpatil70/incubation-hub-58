import 'package:papermind/core/models/user_profile.dart';

class Paper {
  const Paper({
    required this.id,
    required this.title,
    required this.authors,
    required this.abstract,
    required this.year,
    required this.venue,
    required this.domain,
    required this.difficulty,
    required this.difficultyScore,
    required this.semanticScholarId,
    this.pdfUrl,
    this.arxivId,
    this.externalIds = const {},
    this.doi,
    this.pdfCandidates = const [],
    this.citationCount = 0,
    this.summary,
    this.wordCount = 600,
    this.isBookmarked = false,
  });

  final String id;
  final String title;
  final List<String> authors;
  final String abstract;
  final int year;
  final String venue;
  final String domain;
  final ResearchLevel difficulty;
  final int difficultyScore;
  final String semanticScholarId;
  final String? pdfUrl;
  final String? arxivId;
  final Map<String, String> externalIds;
  final String? doi;
  final List<String> pdfCandidates;
  final int citationCount;
  final String? summary;
  final int wordCount;
  final bool isBookmarked;

  int get estimatedReadingMinutes {
    final readingMinutes = (wordCount / 200).ceil();
    return readingMinutes <= 0 ? 1 : readingMinutes;
  }

  Paper copyWith({
    String? id,
    String? title,
    List<String>? authors,
    String? abstract,
    int? year,
    String? venue,
    String? domain,
    ResearchLevel? difficulty,
    int? difficultyScore,
    String? semanticScholarId,
    String? pdfUrl,
    String? arxivId,
    Map<String, String>? externalIds,
    String? doi,
    List<String>? pdfCandidates,
    int? citationCount,
    String? summary,
    int? wordCount,
    bool? isBookmarked,
  }) {
    return Paper(
      id: id ?? this.id,
      title: title ?? this.title,
      authors: authors ?? this.authors,
      abstract: abstract ?? this.abstract,
      year: year ?? this.year,
      venue: venue ?? this.venue,
      domain: domain ?? this.domain,
      difficulty: difficulty ?? this.difficulty,
      difficultyScore: difficultyScore ?? this.difficultyScore,
      semanticScholarId: semanticScholarId ?? this.semanticScholarId,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      arxivId: arxivId ?? this.arxivId,
      externalIds: externalIds ?? this.externalIds,
      doi: doi ?? this.doi,
      pdfCandidates: pdfCandidates ?? this.pdfCandidates,
      citationCount: citationCount ?? this.citationCount,
      summary: summary ?? this.summary,
      wordCount: wordCount ?? this.wordCount,
      isBookmarked: isBookmarked ?? this.isBookmarked,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'authors': authors,
      'abstract': abstract,
      'pdf_url': pdfUrl,
      'year': year,
      'venue': venue,
      'domain': domain,
      'difficulty': difficulty.name,
      'difficulty_score': difficultyScore,
      'semantic_scholar_id': semanticScholarId,
      'arxiv_id': arxivId,
      'external_ids': externalIds,
      'doi': doi,
      'pdf_candidates': pdfCandidates,
      'citation_count': citationCount,
      'summary': summary,
      'word_count': wordCount,
      'is_bookmarked': isBookmarked,
    };
  }

  static Paper fromJson(Map<String, dynamic> json) {
    return Paper(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      authors: (json['authors'] as List<dynamic>? ?? const [])
          .map((e) => e.toString())
          .toList(),
      abstract: json['abstract'] as String? ?? '',
      pdfUrl: json['pdf_url'] as String?,
      arxivId: json['arxiv_id'] as String?,
      externalIds: _extractExternalIds(
        json['external_ids'] ?? json['externalIds'],
      ),
      doi: json['doi'] as String?,
      year: json['year'] as int? ?? 0,
      venue: json['venue'] as String? ?? 'Unknown Venue',
      domain: json['domain'] as String? ?? 'General',
      difficulty: ResearchLevel.values.firstWhere(
        (e) => e.name == (json['difficulty'] as String? ?? 'beginner'),
        orElse: () => ResearchLevel.beginner,
      ),
      difficultyScore: json['difficulty_score'] as int? ?? 1,
      semanticScholarId: json['semantic_scholar_id'] as String? ?? '',
      pdfCandidates: (json['pdf_candidates'] as List<dynamic>? ?? const [])
          .map((e) => e.toString())
          .where((e) => e.trim().isNotEmpty)
          .toList(),
      citationCount: json['citation_count'] as int? ?? 0,
      summary: json['summary'] as String?,
      wordCount: json['word_count'] as int? ?? 600,
      isBookmarked: json['is_bookmarked'] as bool? ?? false,
    );
  }

  static Map<String, String> _extractExternalIds(dynamic source) {
    if (source is! Map) {
      return const {};
    }

    final values = <String, String>{};
    source.forEach((key, value) {
      final normalizedKey = key.toString().trim();
      final normalizedValue = value?.toString().trim() ?? '';
      if (normalizedKey.isNotEmpty && normalizedValue.isNotEmpty) {
        values[normalizedKey] = normalizedValue;
      }
    });

    return values;
  }
}
