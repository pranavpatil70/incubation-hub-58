import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:papermind/core/services/hive_service.dart';
import 'package:papermind/core/services/local_notification_service.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:papermind/core/widgets/app_toast.dart';
import 'package:papermind/core/widgets/papermind_card.dart';
import 'package:papermind/features/settings/presentation/providers/settings_controller.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _frequency = 'Daily';
  TimeOfDay _notifyTime = const TimeOfDay(hour: 8, minute: 0);

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsControllerProvider);
    final notifier = ref.read(settingsControllerProvider.notifier);
    final width = MediaQuery.sizeOf(context).width;
    final maxWidth = width > 900 ? 740.0 : 620.0;
    final horizontal = width < 420 ? 14.0 : 20.0;

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: ListView(
            padding: EdgeInsets.fromLTRB(horizontal, 12, horizontal, 110),
            children: [
              PaperMindCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Reading Preferences',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: _frequency,
                      decoration: const InputDecoration(labelText: 'Frequency'),
                      items: const [
                        DropdownMenuItem(value: 'Daily', child: Text('Daily')),
                        DropdownMenuItem(
                          value: 'Every 2 days',
                          child: Text('Every 2 days'),
                        ),
                        DropdownMenuItem(
                          value: 'Weekly',
                          child: Text('Weekly'),
                        ),
                      ],
                      onChanged: (value) {
                        if (value != null) {
                          setState(() => _frequency = value);
                        }
                      },
                    ),
                    const SizedBox(height: 12),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Preferred notification time'),
                      subtitle: Text(_notifyTime.format(context)),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () async {
                        final selected = await showTimePicker(
                          context: context,
                          initialTime: _notifyTime,
                        );
                        if (selected != null) {
                          setState(() => _notifyTime = selected);
                          await ref
                              .read(localNotificationServiceProvider)
                              .scheduleDailyReminder(selected);
                        }
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              PaperMindCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'App Settings',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.lightSurfaceMuted,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        'Playful light mode is active across the app.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Font Size',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    Slider(
                      value: settings.fontScale,
                      min: 0.85,
                      max: 1.25,
                      divisions: 4,
                      label: settings.fontScale.toStringAsFixed(2),
                      onChanged: notifier.setFontScale,
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton(
                      onPressed: () async {
                        await ref
                            .read(hiveServiceProvider)
                            .clearBox(HiveService.cacheBoxName);
                        if (!context.mounted) {
                          return;
                        }
                        context.showAppToast('Offline cache cleared.');
                      },
                      child: const Text('Clear cache'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
