import 'package:beat_drift/features/settings/presentation/settings_cubit.dart';
import 'package:beat_drift/features/settings/presentation/settings_state.dart';
import 'package:beat_drift/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.settings),
      ),
      body: BlocBuilder<SettingsCubit, SettingsState>(
        builder: (context, state) {
          final cubit = context.read<SettingsCubit>();
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                l10n.language,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              _LocalePicker(
                value: state.locale,
                onChanged: cubit.setLocale,
              ),
              const SizedBox(height: 24),
              Text(
                l10n.audio,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              SwitchListTile.adaptive(
                value: state.isMuted,
                onChanged: (value) => cubit.setMuted(isMuted: value),
                title: Text(l10n.mute),
              ),
              const SizedBox(height: 12),
              _VolumeSlider(
                label: l10n.musicVolume,
                value: state.musicVolume,
                onChanged: cubit.setMusicVolume,
              ),
              const SizedBox(height: 12),
              _VolumeSlider(
                label: l10n.sfxVolume,
                value: state.sfxVolume,
                onChanged: cubit.setSfxVolume,
              ),
            ],
          );
        },
      ),
    );
  }
}

class _LocalePicker extends StatelessWidget {
  const _LocalePicker({
    required this.value,
    required this.onChanged,
  });

  final Locale? value;
  final ValueChanged<Locale?> onChanged;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return RadioGroup<Locale?>(
      groupValue: value,
      onChanged: onChanged,
      child: Column(
        children: [
          RadioListTile<Locale?>(
            value: null,
            title: Text(l10n.systemLanguage),
          ),
          for (final locale in AppLocalizations.supportedLocales)
            RadioListTile<Locale?>(
              value: locale,
              title: Text(_labelFor(l10n, locale)),
            ),
        ],
      ),
    );
  }

  String _labelFor(AppLocalizations l10n, Locale locale) {
    return switch (locale.languageCode) {
      'en' => l10n.languageNameEn,
      'zh' => l10n.languageNameZhHans,
      'ja' => l10n.languageNameJa,
      'ko' => l10n.languageNameKo,
      'th' => l10n.languageNameTh,
      'id' => l10n.languageNameId,
      _ => locale.toLanguageTag(),
    };
  }
}

class _VolumeSlider extends StatelessWidget {
  const _VolumeSlider({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final double value;
  final ValueChanged<double> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        Slider.adaptive(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }
}
