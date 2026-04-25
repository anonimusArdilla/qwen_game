import 'dart:ui';

import 'package:flame/components.dart';
import 'package:flame/game.dart';

class BeatDriftGame extends FlameGame {
  BeatDriftGame()
      : super(
          camera: CameraComponent.withFixedResolution(width: 360, height: 640),
        );

  int score = 0;

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    world.add(_Background());
  }

}

class _Background extends PositionComponent {
  _Background() : super(anchor: Anchor.topLeft);

  @override
  void render(Canvas canvas) {
    canvas.drawRect(
      size.toRect(),
      Paint()..color = const Color(0xFF06070A),
    );

    final lanePaint = Paint()
      ..color = const Color(0xFF1B1E2B)
      ..strokeWidth = 2;

    final w = size.x;
    final h = size.y;
    for (final x in [w * 0.25, w * 0.5, w * 0.75]) {
      canvas.drawLine(Offset(x, 0), Offset(x, h), lanePaint);
    }
  }

  @override
  void onGameResize(Vector2 size) {
    super.onGameResize(size);
    this.size = size;
  }
}
