# Architecture

## Goals
- Flame runtime and Flutter UI are strictly separated
- Deterministic, frame-rate independent update loop
- Explicit dependency injection and testable boundaries
- Offline-first with graceful degradation for backend/SDK failures

## Module Layout
- lib/app: Flutter app composition root (MaterialApp, theming, localization wiring)
- lib/core:
  - env: typed access to dotenv-loaded variables
  - env_validator.dart: startup validation for required configuration
  - di: GetIt-based service registration
  - audio: audio abstraction + Flame implementation
- lib/features:
  - settings: persistent settings (locale, audio) with repository + cubit
  - home: main menu entry
- lib/game:
  - BeatDriftGame: FlameGame implementation (no Flutter dependencies)
  - presentation: GameWidget shell + HUD overlay widgets

## Dependency Rule
- features/*/domain depends on nothing but Dart + core types
- features/*/data depends on external packages and implements domain interfaces
- features/*/presentation depends on Flutter and calls domain/data through DI
- lib/game does not depend on Flutter UI state; overlays are fed by explicit data

## DI Strategy
- Single composition root in bootstrap:
  - load dotenv
  - validate env
  - initialize GetIt graph
  - runApp
- GetIt registrations live in lib/core/di/service_locator.dart

## Localization
- ARB-driven localization under lib/l10n
- MaterialApp wires AppLocalizations delegates and supported locales
- Locale selection is persisted via SettingsRepository

