# Asset Pipeline

## Directory Plan
- assets/audio/bgm/
- assets/audio/sfx/
- assets/images/ui/
- assets/images/sprites/
- assets/fonts/

## Naming
- snake_case filenames
- audio:
  - bgm_<theme>_<loop>.ogg
  - sfx_<event>.wav
- sprites:
  - spr_<entity>_<variant>.png

## Audio Formats
- BGM: OGG (loop-friendly, good size/quality balance)
- SFX: WAV for latency-critical sounds, small file sizes only

## Localization Text
- All UI strings are in ARB files under lib/l10n
- No hardcoded user-facing strings in Dart code

