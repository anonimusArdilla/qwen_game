# Beat Drift — Game Design

## High Concept
Beat Drift is a portrait, one-hand, rhythm-synced lane dodger. The player drifts between lanes to avoid obstacles and collect coins in short, chained micro-stages. Each run targets 2–5 minutes and ends with a clear reward screen that feeds progression.

## Core Loop
1. Select stage → start run
2. Survive successive micro-stages with escalating patterns
3. Earn coins + stage stars + achievement progress
4. Spend coins on cosmetics (skins/themes) and convenience upgrades
5. Unlock next stages/worlds and repeat at higher difficulty

## Controls
- Primary: press-and-drag (or swipe) horizontally to change lanes
- Optional accessibility: tap left/right halves to step one lane

## Session Structure
- A stage is a chain of 4–8 micro-stages, each 20–35 seconds
- Natural breakpoints: after each micro-stage and after each full stage clear
- Fail state: collision or missing required beats leads to “Run End”

## Difficulty Curve
- World-based introduction: each world introduces one new obstacle archetype
- Within a stage: pattern density increases every micro-stage
- Global scaling: adaptive speed modifier increases after repeated clears

## Progression
- Worlds → Stages → Micro-stages
- Star rating per stage (0–3) based on hits taken, combo, and completion time
- Checkpoints: micro-stage boundaries act as checkpoints for “continue”

## Retention Hooks (Asia-optimized)
- Daily login streak rewards with capped inflation
- Lightweight “daily challenge” stage with leaderboard entry
- Cosmetic collection with visible set completion
- Achievements that guide skill learning and encourage replay

## Monetization (Ads Only, Low Intrusion)
- Rewarded video:
  - Continue from last checkpoint (once per stage)
  - Optional “double coins” on stage end (cooldown-based)
- Interstitial:
  - Only after completing every 3 stages
  - 5-minute cooldown
  - After first exposure, player can permanently disable interstitials
- No banner ads, no forced cold-start popups

