import 'package:beat_drift/core/env/env.dart';

class EnvValidator {
  static Future<void> validate() async {
    final env = Env.appEnv;
    if (!_allowedEnvs.contains(env)) {
      throw StateError(
        'APP_ENV must be one of: ${_allowedEnvs.join(', ')}',
      );
    }
  }

  static const List<String> _allowedEnvs = ['dev', 'staging', 'prod'];
}

