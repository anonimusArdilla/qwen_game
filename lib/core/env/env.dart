import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String? get appEnvRaw => dotenv.env['APP_ENV'];

  static String get appEnv =>
      appEnvRaw?.trim().isNotEmpty == true ? appEnvRaw!.trim() : 'dev';

  static String? get supabaseUrl => _optional('SUPABASE_URL');
  static String? get supabaseAnonKey => _optional('SUPABASE_ANON_KEY');

  static String? get appLovinSdkKey => _optional('APPLOVIN_SDK_KEY');
  static String? get appLovinRewardedUnitId =>
      _optional('APPLOVIN_REWARDED_AD_UNIT_ID');
  static String? get appLovinInterstitialUnitId =>
      _optional('APPLOVIN_INTERSTITIAL_AD_UNIT_ID');

  static String? _optional(String key) {
    final value = dotenv.env[key];
    if (value == null) {
      return null;
    }
    final trimmed = value.trim();
    return trimmed.isEmpty ? null : trimmed;
  }
}
