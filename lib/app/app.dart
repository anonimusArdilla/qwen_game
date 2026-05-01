import 'package:beat_drift/core/di/service_locator.dart';
import 'package:beat_drift/features/home/presentation/home_screen.dart';
import 'package:beat_drift/features/settings/presentation/settings_cubit.dart';
import 'package:beat_drift/features/settings/presentation/settings_state.dart';
import 'package:beat_drift/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<SettingsCubit>(
      create: (_) => ServiceLocator.get<SettingsCubit>(),
      child: BlocBuilder<SettingsCubit, SettingsState>(
        builder: (context, state) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            onGenerateTitle: (context) => AppLocalizations.of(context).appTitle,
            locale: state.locale,
            supportedLocales: AppLocalizations.supportedLocales,
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            theme: ThemeData(
              useMaterial3: true,
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFF3D5AFE),
              ),
            ),
            home: const HomeScreen(),
          );
        },
      ),
    );
  }
}
