import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/config/env.dart';
import 'package:papermind/core/services/api_client.dart';

final arxivServiceProvider = Provider<ArxivService>(
  (ref) => ArxivService(ref.read(dioProvider)),
);

class ArxivLookupResult {
  const ArxivLookupResult({required this.arxivId, required this.pdfUrl});

  final String arxivId;
  final String pdfUrl;
}

class ArxivService {
  ArxivService(this._dio);

  final Dio _dio;

  Future<ArxivLookupResult?> lookupByTitle(String title) async {
    final normalized = title.trim();
    if (normalized.length < 8) {
      return null;
    }

    final uri = Uri.parse(Env.arxivBaseUrl).replace(
      queryParameters: {
        'search_query': 'ti:"$normalized"',
        'start': '0',
        'max_results': '1',
        'sortBy': 'relevance',
        'sortOrder': 'descending',
      },
    );

    try {
      final response = await _dio.get<String>(
        uri.toString(),
        options: Options(
          responseType: ResponseType.plain,
          receiveTimeout: const Duration(seconds: 22),
          headers: const {'Accept': 'application/atom+xml,text/xml,*/*'},
        ),
      );

      final xml = response.data;
      if (xml == null || xml.isEmpty) {
        return null;
      }

      final entryMatch = RegExp(
        r'<entry>([\s\S]*?)</entry>',
        caseSensitive: false,
      ).firstMatch(xml);
      final entry = entryMatch?.group(1);
      if (entry == null || entry.isEmpty) {
        return null;
      }

      final idFromEntry = RegExp(
        r'<id>\s*https?://arxiv\.org/abs/([^<]+)\s*</id>',
        caseSensitive: false,
      ).firstMatch(entry)?.group(1);

      final pdfLink =
          RegExp(
            r'<link[^>]*title="pdf"[^>]*href="([^"]+)"',
            caseSensitive: false,
          ).firstMatch(entry)?.group(1) ??
          RegExp(
            r'<link[^>]*type="application/pdf"[^>]*href="([^"]+)"',
            caseSensitive: false,
          ).firstMatch(entry)?.group(1);

      final arxivId = extractArxivId(idFromEntry) ?? extractArxivId(pdfLink);
      if (arxivId == null) {
        return null;
      }

      final canonicalPdf =
          _normalizePdfUrl(pdfLink) ??
          _normalizePdfUrl('https://arxiv.org/pdf/$arxivId.pdf');
      if (canonicalPdf == null) {
        return null;
      }

      return ArxivLookupResult(arxivId: arxivId, pdfUrl: canonicalPdf);
    } catch (_) {
      return null;
    }
  }

  String? extractArxivId(String? source) {
    if (source == null || source.trim().isEmpty) {
      return null;
    }

    final trimmed = source.trim();
    final uriMatch = RegExp(
      r'arxiv\.org/(?:abs|pdf)/([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)',
      caseSensitive: false,
    ).firstMatch(trimmed);
    if (uriMatch != null) {
      return uriMatch.group(1);
    }

    final rawMatch = RegExp(
      r'^([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)$',
      caseSensitive: false,
    ).firstMatch(trimmed);
    return rawMatch?.group(1);
  }

  String? extractArxivIdFromCanonicalDoi(String? source) {
    if (source == null || source.trim().isEmpty) {
      return null;
    }

    final normalized = source
        .trim()
        .replaceFirst(
          RegExp(r'^https?://(?:dx\.)?doi\.org/', caseSensitive: false),
          '',
        )
        .replaceFirst(RegExp(r'^doi:', caseSensitive: false), '');

    final canonicalMatch = RegExp(
      r'^10\.48550/arXiv\.([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)$',
      caseSensitive: false,
    ).firstMatch(normalized);

    return canonicalMatch?.group(1);
  }

  List<String> buildPdfCandidates({
    String? primaryPdfUrl,
    String? arxivId,
    Iterable<String> extra = const [],
  }) {
    final candidates = <String>{};

    void addCandidate(String? value) {
      final normalized = _normalizePdfUrl(value);
      if (normalized != null) {
        candidates.add(normalized);
      }
    }

    addCandidate(primaryPdfUrl);
    for (final item in extra) {
      addCandidate(item);
    }
    if (arxivId != null && arxivId.isNotEmpty) {
      addCandidate('https://arxiv.org/pdf/$arxivId.pdf');
    }

    return candidates.toList(growable: false);
  }

  String? _normalizePdfUrl(String? source) {
    if (source == null || source.trim().isEmpty) {
      return null;
    }

    var normalized = source.trim();
    if (!normalized.startsWith('http://') &&
        !normalized.startsWith('https://')) {
      return null;
    }

    if (normalized.startsWith('http://')) {
      normalized = normalized.replaceFirst('http://', 'https://');
    }

    if (normalized.contains('arxiv.org/abs/')) {
      normalized = normalized.replaceFirst('/abs/', '/pdf/');
    }

    final arxivPdf = RegExp(r'arxiv\.org/pdf/', caseSensitive: false);
    if (arxivPdf.hasMatch(normalized) &&
        !normalized.toLowerCase().endsWith('.pdf')) {
      normalized = '$normalized.pdf';
    }

    return normalized;
  }
}
