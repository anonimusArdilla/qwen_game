import 'package:beat_drift/core/audio/audio_controller.dart';
import 'package:beat_drift/features/settings/data/shared_preferences_settings_repository.dart';
import 'package:beat_drift/features/settings/domain/settings_repository.dart';
import 'package:beat_drift/features/settings/presentation/settings_cubit.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ServiceLocator {
  static final GetIt _getIt = GetIt.instance;

  static T get<T extends Object>() => _getIt<T>();

  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _getIt.registerSingleton<SharedPreferences>(prefs);

    _getIt.registerLazySingleton<SettingsRepository>(
      () => SharedPreferencesSettingsRepository(_getIt<SharedPreferences>()),
    );

    _getIt.registerLazySingleton<AudioController>(FlameAudioController.new);
    await _getIt<AudioController>().init();

    _getIt.registerFactory<SettingsCubit>(
      () => SettingsCubit(
        repository: _getIt<SettingsRepository>(),
        audio: _getIt<AudioController>(),
      ),
    );
  }
}
