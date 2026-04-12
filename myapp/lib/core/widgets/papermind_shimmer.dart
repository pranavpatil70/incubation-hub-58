import 'package:flutter/material.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:shimmer/shimmer.dart';

class PaperMindShimmer extends StatelessWidget {
  const PaperMindShimmer({
    this.height = 120,
    this.width = double.infinity,
    this.radius = 16,
    super.key,
  });

  final double height;
  final double width;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final base = AppColors.lightSurfaceMuted;
    final highlight = Colors.white;

    return Shimmer.fromColors(
      baseColor: base,
      highlightColor: highlight,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: base,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}
