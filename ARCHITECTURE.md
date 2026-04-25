# ARCHITECTURE DOCUMENTATION: COSMIC DASH

## Backend Selection: Firebase

### Decision Rationale

After evaluating Appwrite, Firebase, Supabase, and PlayFab, **Firebase** was selected for the following reasons:

#### Advantages for This Project

1. **Real-time Database**: Firestore provides automatic sync across devices with offline persistence
2. **Authentication**: Built-in support for Google, Apple, anonymous, and email auth
3. **Remote Config**: Live tuning of game balance, ad frequency, and feature flags without app updates
4. **Analytics**: Deep integration with Google Analytics for games, funnel analysis, retention tracking
5. **Cloud Functions**: Server-side logic for anti-cheat, leaderboard calculations, daily rewards
6. **Storage**: CDN-backed asset hosting for dynamic content (seasonal events, A/B test assets)
7. **Crashlytics**: Real-time crash reporting with user journey context
8. **Performance Monitoring**: Track FPS, network latency, slow frames automatically
9. **Asian Market Presence**: Strong infrastructure in JP, KR, SEA regions (CN requires partner but architecture supports migration)
10. **Cost Structure**: Generous free tier, predictable scaling, no upfront costs

#### Comparison Matrix

| Feature | Firebase | Appwrite | Supabase | PlayFab |
|---------|----------|----------|----------|---------|
| Real-time Sync | ✅ Excellent | ⚠️ Limited | ✅ Good | ✅ Good |
| Auth Providers | ✅ 10+ | ⚠️ 5+ | ✅ 10+ | ✅ 8+ |
| Remote Config | ✅ Native | ❌ None | ❌ None | ✅ Good |
| Game Analytics | ✅ Specialized | ⚠️ Generic | ⚠️ Generic | ✅ Specialized |
| Cloud Functions | ✅ Node.js | ✅ Multiple | ✅ Multiple | ✅ Multiple |
| Free Tier | ✅ Generous | ✅ Good | ✅ Good | ⚠️ Limited |
| Asian Latency | ✅ Good | ⚠️ Variable | ⚠️ Variable | ✅ Good |
| Documentation | ✅ Excellent | ⚠️ Growing | ✅ Good | ✅ Good |
| Flutter SDK | ✅ Official | ✅ Community | ✅ Official | ✅ Official |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUTTER CLIENT                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Flame      │  │   Flutter    │  │   Services   │          │
│  │   Game Loop  │  │   UI Layer   │  │   Layer      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                  ┌────────▼────────┐                            │
│                  │  State Manager  │                            │
│                  │  (Riverpod)     │                            │
│                  └────────┬────────┘                            │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                   │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐          │
│  │   Local DB   │  │   Network    │  │   Ad         │          │
│  │   (Hive)     │  │   Client     │  │   Manager    │          │
│  └──────────────┘  └──────┬───────┘  └──────────────┘          │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE CLOUD                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Firestore   │  │  Firebase    │  │   Firebase   │          │
│  │  Database    │  │  Auth        │  │  Storage     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐          │
│  │  Remote      │  │  Cloud       │  │  Crashlytics │          │
│  │  Config      │  │  Functions   │  │  & Perf      │          │
│  └──────────────┘  └──────┬───────┘  └──────────────┘          │
│                           │                                     │
│                    ┌──────▼───────┐                            │
│                    │  External    │                            │
│                    │  APIs        │                            │
│                    │  (Ad SDKs)   │                            │
│                    └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

### 1. Domain Layer (Pure Dart)
- Entities: Pure business objects (Player, Level, Achievement, etc.)
- Repositories: Abstract interfaces for data operations
- Use Cases: Single-responsibility business logic
- No external dependencies

### 2. Data Layer (Dart + Firebase)
- Repository Implementations: Firebase Firestore, Auth, Storage
- DTOs: Data Transfer Objects for serialization
- Mappers: Convert between DTOs and Domain Entities
- Local Cache: Hive for offline-first experience

### 3. Presentation Layer (Flutter + Flame)
- UI Widgets: Pure Flutter components
- Game Overlay: HUD, menus, dialogs
- State Management: Riverpod providers
- Flame Components: Game entities, systems

### 4. Services Layer
- Audio Service: JustAudio + audioplayers
- Ad Service: Google Mobile Ads + mediation
- Analytics Service: Firebase Analytics wrapper
- Haptic Service: Unified feedback interface

## Directory Structure

```
lib/
├── main.dart                          # App entry point
├── app.dart                           # MaterialApp configuration
├── core/
│   ├── constants/
│   │   ├── app_constants.dart         # Global constants
│   │   ├── game_constants.dart        # Game balance values
│   │   └── ad_constants.dart          # Ad placement IDs
│   ├── errors/
│   │   ├── exceptions.dart            # Custom exceptions
│   │   └── failures.dart              # Result pattern failures
│   ├── extensions/
│   │   ├── context_extensions.dart    # BuildContext helpers
│   │   ├── num_extensions.dart        # Number formatting
│   │   └── widget_extensions.dart     # Widget utilities
│   ├── utils/
│   │   ├── logger.dart                # Logging utility
│   │   ├── random_generator.dart      # Seeded RNG
│   │   └── date_utils.dart            # Date formatting
│   └── theme/
│       ├── app_theme.dart             # ThemeData
│       ├── colors.dart                # Color palette
│       └── typography.dart            # Text styles
├── domain/
│   ├── entities/
│   │   ├── player.dart                # Player entity
│   │   ├── level.dart                 # Level entity
│   │   ├── achievement.dart           # Achievement entity
│   │   ├── character.dart             # Character/skin entity
│   │   ├── theme.dart                 # Visual theme entity
│   │   └── powerup.dart               # Power-up entity
│   ├── repositories/
│   │   ├── player_repository.dart     # Player data contract
│   │   ├── level_repository.dart      # Level progress contract
│   │   ├── achievement_repository.dart # Achievement contract
│   │   ├── shop_repository.dart       # Shop/purchase contract
│   │   └── ad_repository.dart         # Ad operations contract
│   └── usecases/
│       ├── player/
│       │   ├── get_player_stats.dart
│       │   ├── update_player_progress.dart
│       │   └── claim_daily_reward.dart
│       ├── level/
│       │   ├── complete_level.dart
│       │   └── get_level_data.dart
│       ├── achievement/
│       │   ├── check_achievements.dart
│       │   └── claim_achievement.dart
│       └── shop/
│           ├── purchase_character.dart
│           └── equip_item.dart
├── data/
│   ├── datasources/
│   │   ├── remote/
│   │   │   ├── firebase_auth_source.dart
│   │   │   ├── firestore_source.dart
│   │   │   └── remote_config_source.dart
│   │   └── local/
│   │       ├── hive_source.dart
│   │       └── preferences_source.dart
│   ├── models/
│   │   ├── player_model.dart          # Player DTO
│   │   ├── level_model.dart           # Level DTO
│   │   └── ...                        # Other DTOs
│   ├── repositories/
│   │   ├── player_repository_impl.dart
│   │   ├── level_repository_impl.dart
│   │   └── ...                        # Repository implementations
│   └── mappers/
│       ├── player_mapper.dart
│       └── ...                        # Entity-DTO mappers
├── presentation/
│   ├── providers/
│   │   ├── game_provider.dart         # Game state provider
│   │   ├── player_provider.dart       # Player stats provider
│   │   ├── shop_provider.dart         # Shop state provider
│   │   ├── settings_provider.dart     # Settings provider
│   │   └── ad_provider.dart           # Ad state provider
│   ├── screens/
│   │   ├── splash/
│   │   │   └── splash_screen.dart
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── game/
│   │   │   └── game_screen.dart
│   │   ├── shop/
│   │   │   └── shop_screen.dart
│   │   ├── achievements/
│   │   │   └── achievements_screen.dart
│   │   ├── settings/
│   │   │   └── settings_screen.dart
│   │   └── leaderboards/
│   │       └── leaderboards_screen.dart
│   ├── widgets/
│   │   ├── common/
│   │   │   ├── custom_button.dart
│   │   │   ├── coin_display.dart
│   │   │   └── loading_indicator.dart
│   │   ├── shop/
│   │   │   ├── character_card.dart
│   │   │   └── theme_preview.dart
│   │   └── achievements/
│   │       └── achievement_tile.dart
│   └── overlays/
│       ├── hud_overlay.dart           # In-game HUD
│       ├── pause_menu.dart            # Pause overlay
│       └── game_over_screen.dart      # Game over overlay
├── game/
│   ├── cosmic_dash_game.dart          # Main Flame game class
│   ├── components/
│   │   ├── player/
│   │   │   ├── player_component.dart
│   │   │   └── player_animation.dart
│   │   ├── obstacles/
│   │   │   ├── obstacle_component.dart
│   │   │   ├── static_obstacle.dart
│   │   │   └── moving_obstacle.dart
│   │   ├── collectibles/
│   │   │   ├── orb_component.dart
│   │   │   └── powerup_component.dart
│   │   ├── environment/
│   │   │   ├── background_component.dart
│   │   │   ├── lane_component.dart
│   │   │   └── particle_system.dart
│   │   └── effects/
│   │       ├── score_popup.dart
│   │       └── combo_effect.dart
│   ├── systems/
│   │   ├── collision_system.dart      # Collision detection
│   │   ├── spawn_system.dart          # Object spawning
│   │   ├── score_system.dart          # Score calculation
│   │   └── difficulty_system.dart     # Dynamic difficulty
│   ├── world/
│   │   ├── level_generator.dart       # Procedural generation
│   │   ├── biome_manager.dart         # Biome transitions
│   │   └── checkpoint_manager.dart    # Checkpoint logic
│   └── services/
│       ├── game_audio_service.dart    # In-game audio
│       └── haptic_feedback_service.dart # Haptic feedback
├── services/
│   ├── audio/
│   │   ├── audio_service.dart         # Main audio controller
│   │   ├── audio_cache.dart           # Audio preloading
│   │   └── audio_settings.dart        # Volume management
│   ├── ads/
│   │   ├── ad_service.dart            # Ad mediation
│   │   ├── rewarded_ad_handler.dart   # Rewarded ad logic
│   │   └── interstitial_handler.dart  # Interstitial logic
│   ├── analytics/
│   │   └── analytics_service.dart     # Event tracking
│   ├── localization/
│   │   └── localization_service.dart  # i18n management
│   └── cloud/
│       ├── cloud_save_service.dart    # Save/load cloud
│       └── leaderboard_service.dart   # Leaderboard ops
└── di/
    ├── injection_container.dart       # Dependency injection
    └── modules/
        ├── database_module.dart
        ├── network_module.dart
        └── service_module.dart

assets/
├── audio/
│   ├── music/
│   │   ├── menu_bgm.ogg
│   │   ├── gameplay_bgm.ogg
│   │   └── ...
│   └── sfx/
│       ├── collect.ogg
│       ├── hit.ogg
│       └── ...
├── images/
│   ├── characters/
│   ├── obstacles/
│   ├── collectibles/
│   ├── backgrounds/
│   └── ui/
├── fonts/
│   ├── NotoSans-Regular.ttf
│   ├── NotoSansCJK-Regular.ttc
│   └── NotoSansThai-Regular.ttf
└── l10n/
    ├── app_en.arb
    ├── app_zh.arb
    ├── app_ja.arb
    ├── app_ko.arb
    ├── app_th.arb
    └── app_id.arb

test/
├── unit/
│   ├── domain/
│   │   └── usecases/
│   └── data/
│       └── repositories/
├── widget/
│   └── screens/
├── integration/
│   └── game_flow_test.dart
└── performance/
    └── fps_benchmark_test.dart
```

## State Management: Riverpod

### Why Riverpod?
1. **Compile-time Safety**: No runtime provider errors
2. **Testability**: Easy to override providers in tests
3. **Composition**: Providers can depend on other providers
4. **Auto-dispose**: Memory-efficient cleanup
5. **Family Modifiers**: Parameterized providers
6. **DevTools Integration**: Built-in state inspection

### Provider Architecture

```dart
// Example provider structure
@riverpod
class GameNotifier extends _$GameNotifier {
  @override
  GameState build() {
    return GameState.initial();
  }

  Future<void> startLevel(int levelId) async {
    // Business logic here
  }

  void pause() {
    state = state.copyWith(status: GameStatus.paused);
  }
}

@riverpod
class PlayerNotifier extends _$PlayerNotifier {
  @override
  Future<PlayerStats> build() async {
    // Fetch from repository
    return ref.watch(playerRepositoryProvider).getStats();
  }

  Future<void> updateCoins(int amount) async {
    // Update both local and cloud
  }
}
```

## Performance Optimization Strategy

### Rendering Pipeline
1. **Sprite Batching**: Group sprites by texture atlas
2. **Object Pooling**: Reuse components instead of create/destroy
3. **Frustum Culling**: Only render visible objects
4. **LOD System**: Reduce detail for distant objects
5. **Texture Compression**: ASTC/ETC2 for mobile GPUs

### Memory Management
1. **Asset Loading**: Lazy load with progress indicators
2. **Cache Eviction**: LRU cache for textures/audio
3. **Dispose Pattern**: Explicit cleanup in dispose() methods
4. **Weak References**: Avoid memory leaks in callbacks

### Frame Budget (16.67ms for 60 FPS)
- Update: 4ms
- Physics: 3ms
- Collision: 2ms
- Render: 5ms
- Buffer: 2.67ms

## Security Considerations

### Anti-Cheat Measures
1. **Server-Side Validation**: Critical logic in Cloud Functions
2. **Signature Verification**: Signed API requests
3. **Rate Limiting**: Prevent spam/farming
4. **Behavioral Analysis**: Detect impossible scores
5. **Obfuscation**: R8/Proguard for release builds

### Data Protection
1. **Encryption**: Sensitive data encrypted at rest
2. **Secure Storage**: Flutter secure storage for tokens
3. **Certificate Pinning**: Prevent MITM attacks
4. **Privacy Compliance**: GDPR, CCPA, COPPA adherence

## Testing Strategy

### Test Pyramid
```
        /\
       /  \      E2E Tests (5%)
      /____\    
     /        \   Integration Tests (15%)
    /__________\ 
   /            \  Unit Tests (80%)
  /______________\
```

### Coverage Targets
- Domain Layer: 95%+
- Data Layer: 85%+
- Presentation Layer: 70%+
- Game Logic: 90%+

### Performance Testing
- FPS monitoring on 10+ device profiles
- Memory leak detection with automated scripts
- Load testing for backend services
- Network condition simulation (3G, 4G, WiFi)

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Build & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup flutter
      - run tests
      - upload coverage

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup flutter
      - build apk/aab
      - sign release
      - upload to play store (internal)

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - checkout
      - setup flutter
      - build ipa
      - sign release
      - upload to testflight
```

## Monitoring & Observability

### Key Metrics Dashboard
1. **Technical**: FPS, crash rate, ANR rate, app size
2. **Engagement**: DAU, MAU, session length, retention
3. **Monetization**: ARPDAU, LTV, ad fill rate, eCPM
4. **Progression**: Level completion rates, difficulty spikes

### Alerting Rules
- Crash rate > 2% → Page on-call
- FPS < 30 for >10% users → Create ticket
- Ad fill rate < 80% → Investigate SDK
- Server error rate > 1% → Immediate investigation

---

*This architecture document guides all technical implementation decisions. Deviations require documented justification.*
