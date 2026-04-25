# GAME DESIGN DOCUMENT: COSMIC DASH

## Executive Summary
**Cosmic Dash** is an infinite runner arcade game optimized for mobile devices, targeting mass appeal across global markets with strong Asian market retention. Players control a cosmic explorer navigating through procedurally generated space tunnels, collecting energy orbs while avoiding obstacles.

## Market Research & Justification (2024-2026 Trends)

### Why Infinite Runner?
1. **High Replayability**: Procedural generation ensures no two runs are identical
2. **Session Length**: Perfect 2-5 minute sessions matching commute/break patterns
3. **Low Cognitive Load**: Simple one-touch controls accessible to all demographics
4. **Ad-Friendly**: Natural break points between runs for non-invasive ad placement
5. **Asian Market Fit**: Proven success of similar titles (Subway Surfers, Temple Run) in CN/JP/KR/TH/ID markets

### Retention Metrics Target
- D1 Retention: 45%+
- D7 Retention: 20%+
- D30 Retention: 8%+
- Average Session: 3.5 minutes
- Sessions per Day: 4-6

## Core Game Loop

```
[START RUN] → [COLLECT ORBS] → [AVOID OBSTACLES] → [COMPLETE LEVEL/FAIL] 
       ↓                                              ↓
   [POWER-UPS]                                   [GAME OVER]
       ↓                                              ↓
   [COMBO SYSTEM]                              [REWARD SCREEN]
                                                      ↓
                                              [SHOP/UPGRADES] → [REPEAT]
```

## Control Scheme
- **Single Touch Control**: Tap left/right side of screen to switch lanes
- **Swipe Up**: Jump (optional advanced control)
- **Swipe Down**: Slide/Duck (optional advanced control)
- **Auto-Run**: Character moves forward automatically

### Lane System
- 3-lane system (Left, Center, Right)
- Smooth lane transition animation (0.15s)
- Input buffer for responsive controls

## Difficulty Curve

### Progressive Scaling
| Level Range | Base Speed | Obstacle Density | Power-up Frequency |
|-------------|-----------|------------------|-------------------|
| 1-5         | 1.0x      | Low              | High              |
| 6-15        | 1.2x      | Medium           | Medium            |
| 16-30       | 1.5x      | High             | Medium            |
| 31-50       | 1.8x      | Very High        | Low               |
| 51+         | 2.0x+     | Extreme          | Low               |

### Dynamic Difficulty Adjustment (DDA)
- If player fails 3+ times consecutively: reduce obstacle density by 10%
- If player completes 5+ levels without failure: increase challenge slightly
- Invisible system to maintain flow state

## Session Design
- **Target Duration**: 2-5 minutes per run
- **Level Length**: 60-90 seconds each
- **Checkpoint System**: Every 3 levels (auto-save + continue option)
- **Daily Challenges**: 3 rotating objectives for retention

## Progression System

### Player Level
- XP earned from: distance traveled, orbs collected, achievements
- Level rewards: coins, power-ups, unlockable themes
- Prestige system at max level (reset for permanent bonuses)

### Character/Skin Collection
- 20+ unique characters with visual variations
- Rarity tiers: Common, Rare, Epic, Legendary
- Each skin has subtle stat modifiers (±5% balance)

### Power-Up System
1. **Shield**: One-hit protection (10s duration)
2. **Magnet**: Auto-collect nearby orbs (8s duration)
3. **2x Multiplier**: Double orb collection (15s duration)
4. **Slow Motion**: Reduced game speed (6s duration)
5. **Invincibility**: Pass through obstacles (5s duration)

## Economy Design

### Currency Sources (Sinks must exceed sources by 15%)
**Sources:**
- Orb collection: 1-3 coins per orb
- Level completion: 10-50 coins based on performance
- Daily login: 50-200 coins (7-day cycle)
- Achievement rewards: 100-1000 coins
- Ad rewards (optional): 50-200 coins per rewarded ad

**Sinks:**
- Character purchases: 500-5000 coins
- Theme purchases: 300-3000 coins
- Power-up upgrades: 100-2000 coins
- Continue after failure: 100 coins (or watch ad)
- Retry with bonus: 50 coins

### Balance Philosophy
- Free-to-play friendly: all content earnable without ads
- Ads accelerate progression by ~30%
- No pay-to-win mechanics
- Daily engagement rewarded generously

## Content Scalability

### Procedural Generation Algorithm
- Seed-based level generation for reproducibility
- Obstacle pattern library: 50+ templates
- Combination rules ensure playability
- Biome transitions every 10 levels (visual variety)

### Seasonal Content
- Monthly themed events (Lunar New Year, Cherry Blossom, etc.)
- Limited-time skins and backgrounds
- Special event currencies
- Leaderboard competitions

## Monetization Strategy (Ads Only)

### Ad Placement Philosophy
- **Zero forced ads on app launch**
- **Zero banner ads during gameplay**
- Interstitials only after natural breaks with user consent
- Rewarded ads always optional with clear value proposition

### Implementation Details

**Rewarded Ads (Primary Revenue)**
- Continue after game over: +50 coins or free continue
- Bonus coin multiplier: 2x coins for next run
- Daily bonus chest: additional 100 coins
- Free power-up before run
- Frequency: User-initiated only, unlimited with 30s cooldown between views

**Interstitial Ads (Secondary Revenue)**
- Trigger: After completing 3 levels (natural checkpoint)
- Cooldown: 5 minutes minimum between interstitials
- First impression: Show opt-out toggle in settings
- Never show during active gameplay
- Respect frequency capping: max 8 per day

**Remote Config Controls**
- Adjust interstitial frequency without app update
- Enable/disable ad types by region
- A/B test reward values
- Emergency kill switch for ad networks

### Compliance
- GDPR/CCPA compliance with consent management
- COPPA considerations for younger audiences
- Platform-specific guidelines (App Store, Google Play)
- Clear disclosure of ad-supported nature

## Technical Architecture Highlights

### Performance Targets
- Stable 60 FPS on mid-range devices (3GB RAM, Snapdragon 660+)
- 120 FPS support for high-refresh displays
- <50MB initial download size
- <200MB total storage including assets
- Cold start <2 seconds

### Flame Engine Optimization
- Object pooling for all game entities
- Sprite batching for render efficiency
- Frame-rate independent physics (delta time scaling)
- Deterministic collision detection
- Async asset loading with progress indicators

### State Management
- Clean separation: Game logic (Flame) ↔ UI (Flutter)
- Event-driven communication via streams
- Predictable state transitions
- Rollback support for network sync

## Localization Strategy

### Supported Languages
1. English (EN) - Default fallback
2. Chinese Simplified (ZH)
3. Japanese (JA)
4. Korean (KO)
5. Thai (TH)
6. Indonesian/Bahasa (ID)

### Implementation
- All strings externalized via ARB files
- intl package for formatting (numbers, dates, plurals)
- CJK font fallbacks (Noto Sans CJK)
- Thai font rendering (Noto Sans Thai)
- RTL support ready (for future Arabic expansion)
- Locale auto-detection with manual override

### Cultural Considerations
- Color symbolism varies by region (red = luck in CN, danger in US)
- Number preferences (8 lucky in CN, 4 unlucky in JP)
- Holiday/event timing aligned with regional calendars
- Character designs respect cultural sensitivities

## Achievement System

### Achievement Categories
1. **Progression**: Complete X levels, reach level Y
2. **Collection**: Collect X orbs total, gather all power-ups
3. **Skill**: Perfect runs, combo milestones
4. **Persistence**: Daily login streaks, total playtime
5. **Exploration**: Unlock all themes, try all characters

### Notification System
- In-game popup with icon and description
- Haptic feedback on unlock
- Share button for social virality
- Cloud persistence across devices

## Cloud & Social Features

### Backend Choice: Firebase
**Justification:**
- Real-time database for leaderboards
- Cloud save with conflict resolution
- Remote Config for live tuning
- Analytics integration out-of-box
- Authentication (Google, Apple, anonymous)
- Crashlytics for stability monitoring
- Cost-effective for indie/mid-scale games
- Strong Asian market presence (except CN requiring partner)

### Features
- Cross-device progression sync
- Global and friend leaderboards
- Weekly challenges with global rankings
- Cloud backup/restore
- A/B testing infrastructure

## Art Direction

### Visual Style
- Low-poly 3D aesthetic (performance-friendly)
- Vibrant neon color palette (cosmic theme)
- Particle effects for collectibles and power-ups
- Smooth animations (lerp-based transitions)
- Parallax scrolling backgrounds

### UI/UX Principles
- Minimalist HUD during gameplay
- Clear visual feedback for all actions
- Readable fonts at small sizes
- Accessible color contrast ratios
- Thumb-friendly touch targets (min 48dp)

## Audio Design

### Music
- 5 original BGM tracks (menu, gameplay, boss, victory, game over)
- Dynamic mixing based on game state
- Loop points carefully crafted
- Genre: Synthwave/Electronic (universal appeal)

### Sound Effects
- Collection sounds (pitch variation for interest)
- Obstacle hit feedback
- Power-up activation
- UI interaction sounds
- Character-specific voice lines (optional)

### Audio Settings
- Master volume slider
- Independent music/SFX controls
- Mute toggle
- Quality settings (low/medium/high)
- Pause/resume synchronization

## Testing & QA Strategy

### Automated Testing
- Unit tests for economy calculations
- Widget tests for UI components
- Integration tests for game flow
- Performance regression tests

### Manual Testing Matrix
- Device coverage: 20+ popular models across price ranges
- OS versions: Android 8.0+, iOS 13+
- Network conditions: WiFi, 4G, offline mode
- Interruption handling: calls, notifications, backgrounding

### Analytics Events
- Tutorial completion funnel
- First purchase/conversion tracking
- Retention cohorts
- Difficulty curve validation
- Ad performance metrics

## Roadmap & Content Calendar

### Launch Version (v1.0)
- 50 core levels
- 10 characters
- 5 themes
- Basic achievements (25)
- Core economy

### Post-Launch (Quarterly)
- Q1: +20 levels, +5 characters, seasonal event
- Q2: +20 levels, new game mode, +5 characters
- Q3: +30 levels, guild system, competitive season
- Q4: Major expansion, +50 levels, prestige system

## Success Metrics

### KPIs
- DAU/MAU ratio > 20%
- Average revenue per DAU (ARPDAU): $0.08-0.15
- Lifetime value (LTV): $3-5 at 90 days
- Store rating: 4.5+ stars
- Crash-free sessions: 99.5%+

### Monitoring Dashboard
- Real-time player count
- Revenue tracking
- Retention cohorts
- Level completion rates
- Ad fill rates and eCPM

---

*This document serves as the foundational design for Cosmic Dash. All implementation decisions should reference this document for alignment with core vision.*
