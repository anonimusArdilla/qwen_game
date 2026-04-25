import 'package:equatable/equatable.dart';
import 'package:flutter/widgets.dart';

class SettingsState extends Equatable {
  const SettingsState({
    required this.locale,
    required this.musicVolume,
    required this.sfxVolume,
    required this.isMuted,
    required this.isLoaded,
  });

  final Locale? locale;
  final double musicVolume;
  final double sfxVolume;
  final bool isMuted;
  final bool isLoaded;

  SettingsState copyWith({
    Locale? locale,
    double? musicVolume,
    double? sfxVolume,
    bool? isMuted,
    bool? isLoaded,
  }) {
    return SettingsState(
      locale: locale ?? this.locale,
      musicVolume: musicVolume ?? this.musicVolume,
      sfxVolume: sfxVolume ?? this.sfxVolume,
      isMuted: isMuted ?? this.isMuted,
      isLoaded: isLoaded ?? this.isLoaded,
    );
  }

  @override
  List<Object?> get props => [
        locale?.languageCode,
        locale?.countryCode,
        musicVolume,
        sfxVolume,
        isMuted,
        isLoaded,
      ];

  static const SettingsState initial = SettingsState(
    locale: null,
    musicVolume: 0.8,
    sfxVolume: 0.9,
    isMuted: false,
    isLoaded: false,
  );
}
