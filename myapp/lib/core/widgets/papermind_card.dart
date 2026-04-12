import 'package:flutter/material.dart';
import 'package:papermind/core/theme/app_colors.dart';

class PaperMindCard extends StatelessWidget {
  const PaperMindCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
    this.featured = false,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final bool featured;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Material(
      color: Theme.of(context).cardTheme.color,
      borderRadius: BorderRadius.circular(22),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: featured
                  ? colorScheme.primary.withValues(alpha: 0.30)
                  : colorScheme.outline.withValues(alpha: 0.55),
            ),
            gradient: featured
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      colorScheme.primaryContainer.withValues(alpha: 0.52),
                      AppColors.lightSurfaceMuted.withValues(alpha: 0.72),
                      Theme.of(context).cardTheme.color ??
                          Theme.of(context).colorScheme.surface,
                    ],
                  )
                : null,
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.06),
                blurRadius: 26,
                offset: const Offset(0, 8),
              ),
              if (featured)
                BoxShadow(
                  color: colorScheme.primary.withValues(alpha: 0.16),
                  blurRadius: 34,
                  offset: const Offset(0, 14),
                ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
