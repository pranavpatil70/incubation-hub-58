import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/home/presentation/providers/home_controller.dart';
import 'package:papermind/features/home/presentation/screens/home_screen.dart';
import 'package:papermind/features/home/presentation/screens/library_screen.dart';
import 'package:papermind/features/profile/presentation/screens/profile_screen.dart';

class HomeShellScreen extends ConsumerStatefulWidget {
  const HomeShellScreen({super.key});

  @override
  ConsumerState<HomeShellScreen> createState() => _HomeShellScreenState();
}

class _HomeShellScreenState extends ConsumerState<HomeShellScreen> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = ref.read(authRepositoryProvider).currentUser();
      if (user != null) {
        ref.read(homeControllerProvider.notifier).loadHome(user.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authStateProvider).value;
    final userId = user?.id;

    final pages = [
      HomeScreen(userId: userId),
      LibraryScreen(userId: userId),
      ProfileScreen(userId: userId),
    ];
    final safeIndex = _index.clamp(0, pages.length - 1);

    return Scaffold(
      body: IndexedStack(index: safeIndex, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: safeIndex,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: [
          const NavigationDestination(
            icon: Icon(LucideIcons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.bookOpen),
            label: 'Library',
          ),
          NavigationDestination(icon: Icon(LucideIcons.user), label: 'Profile'),
        ],
      ),
    );
  }
}
