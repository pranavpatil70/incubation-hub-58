import 'package:flutter_test/flutter_test.dart';
import 'package:papermind/core/models/paper.dart';

void main() {
  group('Paper JSON parsing', () {
    test('parses and serializes arXiv metadata fields', () {
      final json = {
        'id': 'paper-1',
        'title': 'Attention Is All You Need',
        'authors': ['A. Author'],
        'abstract': 'A foundational transformer paper.',
        'pdf_url': 'https://arxiv.org/pdf/1706.03762.pdf',
        'year': 2017,
        'venue': 'NeurIPS',
        'domain': 'Machine Learning',
        'difficulty': 'intermediate',
        'difficulty_score': 6,
        'semantic_scholar_id': 'ss-1706',
        'arxiv_id': '1706.03762',
        'external_ids': {
          'ArXiv': '1706.03762',
          'DOI': '10.48550/arXiv.1706.03762',
        },
        'doi': '10.48550/arXiv.1706.03762',
        'pdf_candidates': ['https://arxiv.org/pdf/1706.03762.pdf'],
        'citation_count': 50000,
        'summary': 'A summary',
        'word_count': 1200,
        'is_bookmarked': true,
      };

      final paper = Paper.fromJson(json);

      expect(paper.arxivId, '1706.03762');
      expect(paper.externalIds['ArXiv'], '1706.03762');
      expect(paper.externalIds['DOI'], '10.48550/arXiv.1706.03762');
      expect(paper.doi, '10.48550/arXiv.1706.03762');

      final roundTrip = paper.toJson();
      expect(roundTrip['arxiv_id'], '1706.03762');
      expect(roundTrip['doi'], '10.48550/arXiv.1706.03762');
      expect(roundTrip['external_ids'], {
        'ArXiv': '1706.03762',
        'DOI': '10.48550/arXiv.1706.03762',
      });
    });

    test('parses externalIds camelCase key from cached payloads', () {
      final paper = Paper.fromJson({
        'id': 'paper-2',
        'title': 'Cached entry',
        'authors': [],
        'abstract': 'Cached abstract',
        'year': 2024,
        'venue': 'Unknown Venue',
        'domain': 'General',
        'difficulty': 'beginner',
        'difficulty_score': 1,
        'semantic_scholar_id': 'ss-cached',
        'externalIds': {'ArXiv': '2401.12345'},
      });

      expect(paper.externalIds['ArXiv'], '2401.12345');
    });
  });
}
