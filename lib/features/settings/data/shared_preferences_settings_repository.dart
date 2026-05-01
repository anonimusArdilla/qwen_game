import 'package:beat_drift/features/settings/domain/app_settings.dart';
import 'package:beat_drift/features/settings/domain/settings_repository.dart';
import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SharedPreferencesSettingsRepository implements SettingsRepository {
  SharedPreferencesSettingsRepository(this._prefs);

  final SharedPreferences _prefs;

  @override
  Future<AppSettings> read() async {
    final localeTag = _prefs.getString(_Keys.localeTag);
    final locale = localeTag == null ? null : _parseLocale(localeTag);

    return AppSettings(
      locale: locale,
      musicVolume: _prefs.getDouble(_Keys.musicVolume) ??
          AppSettings.defaults.musicVolume,
      sfxVolume:
          _prefs.getDouble(_Keys.sfxVolume) ?? AppSettings.defaults.sfxVolume,
      isMuted: _prefs.getBool(_Keys.isMuted) ?? AppSettings.defaults.isMuted,
    );
  }

  @override
  Future<void> write(AppSettings settings) async {
    final writes = <Future<bool>>[
      if (settings.locale == null)
        _prefs.remove(_Keys.localeTag).then((_) => true)
      else
        _prefs.setString(_Keys.localeTag, settings.locale!.toLanguageTag()),
      _prefs.setDouble(_Keys.musicVolume, settings.musicVolume),
      _prefs.setDouble(_Keys.sfxVolume, settings.sfxVolume),
      _prefs.setBool(_Keys.isMuted, settings.isMuted),
    ];
    await Future.wait(writes);
  }

  Locale _parseLocale(String tag) {
    final parts = tag.split('-');
    if (parts.isEmpty) {
      return const Locale('en');
    }
    if (parts.length == 1) {
      return Locale(parts.first);
    }
    return Locale.fromSubtags(languageCode: parts[0], countryCode: parts[1]);
  }
}

abstract final class _Keys {
  static const localeTag = 'settings.localeTag';
  static const musicVolume = 'settings.musicVolume';
  static const sfxVolume = 'settings.sfxVolume';
  static const isMuted = 'settings.isMuted';
}
