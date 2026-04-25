import 'package:equatable/equatable.dart';
import 'package:flutter/widgets.dart';

class AppSettings extends Equatable {
  const AppSettings({
    required this.locale,
    required this.musicVolume,
    required this.sfxVolume,
    required this.isMuted,
  });

  final Locale? locale;
  final double musicVolume;
  final double sfxVolume;
  final bool isMuted;

  AppSettings copyWith({
    Locale? locale,
    double? musicVolume,
    double? sfxVolume,
    bool? isMuted,
  }) {
    return AppSettings(
      locale: locale ?? this.locale,
      musicVolume: musicVolume ?? this.musicVolume,
      sfxVolume: sfxVolume ?? this.sfxVolume,
      isMuted: isMuted ?? this.isMuted,
    );
  }

  @override
  List<Object?> get props => [
        locale?.languageCode,
        locale?.countryCode,
        musicVolume,
        sfxVolume,
        isMuted,
      ];

  static const AppSettings defaults = AppSettings(
    locale: null,
    musicVolume: 0.8,
    sfxVolume: 0.9,
    isMuted: false,
  );
}
