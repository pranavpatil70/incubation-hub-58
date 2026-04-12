import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:papermind/core/theme/app_colors.dart';

class AppTheme {
  const AppTheme._();

  static ThemeData light() {
    final base = ThemeData.light(useMaterial3: true);
    final textTheme = _textTheme(base.textTheme, isDark: false);
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.lightBackground,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        primaryContainer: Color(0xFFDDE4FF),
        onPrimaryContainer: Color(0xFF1A2D87),
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        secondaryContainer: Color(0xFFDDF6F1),
        onSecondaryContainer: Color(0xFF0C5B50),
        surfaceContainerHighest: AppColors.lightSurfaceMuted,
        outline: AppColors.border,
        surface: AppColors.lightSurface,
        onSurface: AppColors.lightTextPrimary,
      ),
      textTheme: textTheme,
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: AppColors.primary,
        selectionColor: AppColors.primary.withValues(alpha: 0.24),
        selectionHandleColor: AppColors.primary,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.lightTextPrimary,
        titleTextStyle: GoogleFonts.poppins(
          color: AppColors.lightTextPrimary,
          fontSize: 21,
          fontWeight: FontWeight.w700,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.lightSurface.withValues(alpha: 0.95),
        indicatorColor: AppColors.primary.withValues(alpha: 0.16),
        labelTextStyle: WidgetStatePropertyAll(
          textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: AppColors.primary);
          }
          return const IconThemeData(color: AppColors.lightTextSecondary);
        }),
      ),
      cardTheme: CardThemeData(
        color: AppColors.lightSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: textTheme.titleMedium?.copyWith(fontSize: 15),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.lightTextPrimary,
          side: BorderSide(color: AppColors.border),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: textTheme.titleMedium?.copyWith(fontSize: 15),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.lightSurface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
        ),
      ),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  static ThemeData dark() {
    final base = ThemeData.dark(useMaterial3: true);
    final textTheme = _textTheme(base.textTheme, isDark: true);
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        primaryContainer: Color(0xFF243A99),
        onPrimaryContainer: Color(0xFFE3E8FF),
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        secondaryContainer: Color(0xFF155952),
        onSecondaryContainer: Color(0xFFCEF4ED),
        surfaceContainerHighest: Color(0xFF1C275A),
        outline: Color(0xFF3E4B87),
        surface: AppColors.darkSurface,
        onSurface: AppColors.darkTextPrimary,
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.darkTextPrimary,
        titleTextStyle: GoogleFonts.poppins(
          color: AppColors.darkTextPrimary,
          fontSize: 21,
          fontWeight: FontWeight.w700,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.darkSurface.withValues(alpha: 0.95),
        indicatorColor: AppColors.primary.withValues(alpha: 0.20),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: AppColors.primary);
          }
          return const IconThemeData(color: AppColors.darkTextSecondary);
        }),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: textTheme.titleMedium?.copyWith(fontSize: 15),
        ),
      ),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  static TextTheme _textTheme(TextTheme base, {required bool isDark}) {
    final bodyColor = isDark
        ? AppColors.darkTextPrimary
        : AppColors.lightTextPrimary;
    final secondary = isDark
        ? AppColors.darkTextSecondary
        : AppColors.lightTextSecondary;
    final poppins = GoogleFonts.poppinsTextTheme(base);

    return poppins.copyWith(
      headlineLarge: GoogleFonts.poppins(
        fontSize: 33,
        fontWeight: FontWeight.w700,
        color: bodyColor,
        letterSpacing: -0.3,
      ),
      headlineMedium: GoogleFonts.poppins(
        fontSize: 27,
        fontWeight: FontWeight.w700,
        color: bodyColor,
        letterSpacing: -0.2,
      ),
      titleLarge: GoogleFonts.poppins(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: bodyColor,
      ),
      titleMedium: GoogleFonts.poppins(
        fontSize: 16.2,
        fontWeight: FontWeight.w600,
        color: bodyColor,
      ),
      bodyLarge: GoogleFonts.poppins(
        fontSize: 16,
        color: bodyColor,
        height: 1.45,
      ),
      bodyMedium: GoogleFonts.poppins(
        fontSize: 14.2,
        color: bodyColor,
        height: 1.4,
      ),
      bodySmall: GoogleFonts.poppins(
        fontSize: 12,
        color: secondary,
        height: 1.32,
      ),
      labelMedium: GoogleFonts.poppins(
        fontSize: 11.5,
        color: secondary,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.08,
      ),
    );
  }
}
