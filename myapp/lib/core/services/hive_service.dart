import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

final hiveServiceProvider = Provider<HiveService>(
  (ref) => HiveService.instance,
);

class HiveService {
  HiveService._();

  static final instance = HiveService._();

  static const profileBoxName = 'profile_box';
  static const settingsBoxName = 'settings_box';
  static const cacheBoxName = 'cache_box';
  static const chatBoxName = 'chat_box';

  Future<void> init() async {
    await Hive.initFlutter();
    await Future.wait([
      Hive.openBox(profileBoxName),
      Hive.openBox(settingsBoxName),
      Hive.openBox(cacheBoxName),
      Hive.openBox(chatBoxName),
    ]);
  }

  Box<dynamic> get profileBox => Hive.box(profileBoxName);
  Box<dynamic> get settingsBox => Hive.box(settingsBoxName);
  Box<dynamic> get cacheBox => Hive.box(cacheBoxName);
  Box<dynamic> get chatBox => Hive.box(chatBoxName);

  Future<void> saveJson(
    String boxName,
    String key,
    Map<String, dynamic> value,
  ) async {
    await Hive.box(boxName).put(key, jsonEncode(value));
  }

  Map<String, dynamic>? readJson(String boxName, String key) {
    final raw = Hive.box(boxName).get(key);
    if (raw is String) {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      if (decoded is Map) {
        return decoded.cast<String, dynamic>();
      }
    }
    return null;
  }

  Future<void> saveList(String boxName, String key, List<dynamic> value) async {
    await Hive.box(boxName).put(key, value);
  }

  List<dynamic> readList(String boxName, String key) {
    final raw = Hive.box(boxName).get(key);
    if (raw is List<dynamic>) {
      return raw;
    }
    return const [];
  }

  Future<void> clearBox(String boxName) => Hive.box(boxName).clear();
}
