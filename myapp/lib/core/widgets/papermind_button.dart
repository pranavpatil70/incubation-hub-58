import 'package:flutter/material.dart';

class PaperMindButton extends StatelessWidget {
  const PaperMindButton({
    required this.label,
    required this.onPressed,
    this.icon,
    this.isExpanded = true,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isExpanded;

  @override
  Widget build(BuildContext context) {
    final style = FilledButton.styleFrom(
      minimumSize: const Size.fromHeight(56),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 13),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );

    final Widget button = icon == null
        ? FilledButton(onPressed: onPressed, style: style, child: Text(label))
        : FilledButton.icon(
            onPressed: onPressed,
            style: style,
            icon: Icon(icon, size: 18),
            label: Text(label),
          );

    if (!isExpanded) {
      return button;
    }

    return SizedBox(width: double.infinity, child: button);
  }
}
