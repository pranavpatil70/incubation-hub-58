import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:papermind/core/widgets/papermind_button.dart';

void main() {
  testWidgets('PaperMindButton renders and taps', (WidgetTester tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PaperMindButton(
            label: 'Start Reading',
            onPressed: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Start Reading'), findsOneWidget);

    await tester.tap(find.text('Start Reading'));
    await tester.pump();

    expect(tapped, isTrue);
  });
}
