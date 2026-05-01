import 'package:beat_drift/app/app.dart';
import 'package:beat_drift/core/di/service_locator.dart';
import 'package:beat_drift/core/env_validator.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  await EnvValidator.validate();
  await ServiceLocator.init();
  runApp(const App());
}
