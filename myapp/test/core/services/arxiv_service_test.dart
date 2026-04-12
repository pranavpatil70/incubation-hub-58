import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:papermind/core/services/arxiv_service.dart';

void main() {
  group('ArxivService canonical DOI parsing', () {
    final service = ArxivService(Dio());

    test('extracts id from canonical DOI', () {
      final id = service.extractArxivIdFromCanonicalDoi(
        '10.48550/arXiv.1706.03762',
      );
      expect(id, '1706.03762');
    });

    test('extracts id from canonical DOI URL with version', () {
      final id = service.extractArxivIdFromCanonicalDoi(
        'https://doi.org/10.48550/arXiv.2401.12345v2',
      );
      expect(id, '2401.12345v2');
    });

    test('rejects non-canonical DOI', () {
      final id = service.extractArxivIdFromCanonicalDoi('10.1145/1234567');
      expect(id, isNull);
    });

    test('rejects arbitrary strings containing arXiv-looking text', () {
      final id = service.extractArxivIdFromCanonicalDoi(
        'reference arXiv.1706.03762 in body text',
      );
      expect(id, isNull);
    });
  });
}
