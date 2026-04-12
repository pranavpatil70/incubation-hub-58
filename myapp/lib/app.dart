import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/constants/app_constants.dart';
import 'package:papermind/core/router/app_router.dart';
import 'package:papermind/core/theme/app_theme.dart';
import 'package:papermind/features/settings/presentation/providers/settings_controller.dart';

class PaperMindApp extends ConsumerWidget {
  const PaperMindApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsControllerProvider);
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: AppConstants.appName,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.light,
      routerConfig: router,
      builder: (context, child) {
        final media = MediaQuery.of(context);
        return MediaQuery(
          data: media.copyWith(
            textScaler: TextScaler.linear(settings.fontScale),
          ),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
