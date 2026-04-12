import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/services/hive_service.dart';

final settingsControllerProvider =
    StateNotifierProvider<SettingsController, AppSettings>(
      (ref) => SettingsController(ref.read(hiveServiceProvider)),
    );

class AppSettings {
  const AppSettings({this.themeMode = ThemeMode.light, this.fontScale = 1});

  final ThemeMode themeMode;
  final double fontScale;

  AppSettings copyWith({ThemeMode? themeMode, double? fontScale}) {
    return AppSettings(
      themeMode: themeMode ?? this.themeMode,
      fontScale: fontScale ?? this.fontScale,
    );
  }

  Map<String, dynamic> toJson() {
    return {'theme_mode': themeMode.name, 'font_scale': fontScale};
  }

  static AppSettings fromJson(Map<String, dynamic> json) {
    return AppSettings(
      themeMode: ThemeMode.light,
      fontScale: (json['font_scale'] as num?)?.toDouble() ?? 1,
    );
  }
}

class SettingsController extends StateNotifier<AppSettings> {
  SettingsController(this._hiveService) : super(const AppSettings()) {
    load();
  }

  final HiveService _hiveService;

  Future<void> load() async {
    final raw = _hiveService.readJson(
      HiveService.settingsBoxName,
      'app_settings',
    );
    if (raw != null) {
      state = AppSettings.fromJson(raw);
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = state.copyWith(themeMode: ThemeMode.light);
    await _persist();
  }

  Future<void> setFontScale(double scale) async {
    state = state.copyWith(fontScale: scale);
    await _persist();
  }

  Future<void> _persist() {
    return _hiveService.saveJson(
      HiveService.settingsBoxName,
      'app_settings',
      state.toJson(),
    );
  }
}
