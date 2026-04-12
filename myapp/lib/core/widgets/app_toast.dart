import 'package:flutter/material.dart';

extension AppToast on BuildContext {
  void showAppToast(String message, {VoidCallback? onRetry}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        action: onRetry == null
            ? null
            : SnackBarAction(label: 'Retry', onPressed: onRetry),
      ),
    );
  }
}
