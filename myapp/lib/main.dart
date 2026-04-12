import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/app.dart';
import 'package:papermind/core/config/env.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/core/services/local_notification_service.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');
  await HiveService.instance.init();

  final url = Env.supabaseUrl.isEmpty
      ? 'https://example.supabase.co'
      : Env.supabaseUrl;
  final anonKey = Env.supabaseAnonKey.isEmpty
      ? 'example-anon-key'
      : Env.supabaseAnonKey;

  await Supabase.initialize(url: url, anonKey: anonKey);
  await LocalNotificationService.instance.init();

  runApp(const ProviderScope(child: PaperMindApp()));
}
