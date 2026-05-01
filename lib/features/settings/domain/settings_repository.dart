import 'package:beat_drift/features/settings/domain/app_settings.dart';

abstract interface class SettingsRepository {
  Future<AppSettings> read();
  Future<void> write(AppSettings settings);
}

