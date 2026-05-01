import 'package:beat_drift/app/app.dart';
import 'package:beat_drift/core/audio/audio_controller.dart';
import 'package:beat_drift/features/settings/domain/app_settings.dart';
import 'package:beat_drift/features/settings/domain/settings_repository.dart';
import 'package:beat_drift/features/settings/presentation/settings_cubit.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get_it/get_it.dart';

void main() {
  testWidgets('App boots', (WidgetTester tester) async {
    TestWidgetsFlutterBinding.ensureInitialized();
    final getIt = GetIt.instance;
    await getIt.reset();
    getIt.registerSingleton<AudioController>(_NoopAudioController());
    getIt.registerSingleton<SettingsRepository>(_InMemorySettingsRepository());
    getIt.registerFactory<SettingsCubit>(
      () => SettingsCubit(
        repository: getIt<SettingsRepository>(),
        audio: getIt<AudioController>(),
      ),
    );

    await tester.pumpWidget(const App());
    await tester.pump();

    expect(find.text('Play'), findsOneWidget);
  });
}

class _NoopAudioController implements AudioController {
  @override
  Future<void> init() async {}

  @override
  void setMusicVolume(double value) {}

  @override
  void setSfxVolume(double value) {}

  @override
  void setMuted({required bool isMuted}) {}

  @override
  Future<void> playBgm(String assetPath) async {}

  @override
  Future<void> stopBgm() async {}

  @override
  Future<void> pause() async {}

  @override
  Future<void> resume() async {}

  @override
  Future<void> playSfx(String assetPath) async {}

  @override
  Future<void> dispose() async {}
}

class _InMemorySettingsRepository implements SettingsRepository {
  AppSettings _settings = AppSettings.defaults;

  @override
  Future<AppSettings> read() async => _settings;

  @override
  Future<void> write(AppSettings settings) async {
    _settings = settings;
  }
}
