import 'dart:async';

import 'package:beat_drift/core/audio/audio_controller.dart';
import 'package:beat_drift/features/settings/domain/app_settings.dart';
import 'package:beat_drift/features/settings/domain/settings_repository.dart';
import 'package:beat_drift/features/settings/presentation/settings_state.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SettingsCubit extends Cubit<SettingsState> {
  SettingsCubit({
    required SettingsRepository repository,
    required AudioController audio,
  })  : _repository = repository,
        _audio = audio,
        super(SettingsState.initial) {
    unawaited(_load());
  }

  final SettingsRepository _repository;
  final AudioController _audio;

  Future<void> setLocale(Locale? locale) async {
    final next = state.copyWith(locale: locale);
    emit(next);
    await _persist(next);
  }

  Future<void> setMusicVolume(double volume) async {
    final next = state.copyWith(musicVolume: volume);
    emit(next);
    _audio.setMusicVolume(volume);
    await _persist(next);
  }

  Future<void> setSfxVolume(double volume) async {
    final next = state.copyWith(sfxVolume: volume);
    emit(next);
    _audio.setSfxVolume(volume);
    await _persist(next);
  }

  Future<void> setMuted({required bool isMuted}) async {
    final next = state.copyWith(isMuted: isMuted);
    emit(next);
    _audio.setMuted(isMuted: isMuted);
    await _persist(next);
  }

  Future<void> _load() async {
    final settings = await _repository.read();
    final next = state.copyWith(
      locale: settings.locale,
      musicVolume: settings.musicVolume,
      sfxVolume: settings.sfxVolume,
      isMuted: settings.isMuted,
      isLoaded: true,
    );
    emit(next);
    _audio.setMuted(isMuted: next.isMuted);
    _audio.setMusicVolume(next.musicVolume);
    _audio.setSfxVolume(next.sfxVolume);
  }

  Future<void> _persist(SettingsState state) async {
    await _repository.write(
      AppSettings(
        locale: state.locale,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        isMuted: state.isMuted,
      ),
    );
  }
}
