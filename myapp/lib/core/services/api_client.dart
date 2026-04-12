import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/config/env.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 20),
      sendTimeout: const Duration(seconds: 20),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final path = options.path.toLowerCase();
        final isPdfRequest =
            path.contains('.pdf') ||
            options.headers['Accept'] == 'application/pdf';
        if (isPdfRequest) {
          options.receiveTimeout = const Duration(seconds: 45);
          options.headers['Accept'] =
              'application/pdf,application/octet-stream;q=0.9,*/*;q=0.8';
          options.headers['Cache-Control'] = 'no-cache';
        }

        if (options.baseUrl.contains('openrouter.ai') &&
            Env.openRouterApiKey.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer ${Env.openRouterApiKey}';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        handler.next(error);
      },
    ),
  );

  return dio;
});
