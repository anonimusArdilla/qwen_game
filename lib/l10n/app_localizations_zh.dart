// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appTitle => '节拍漂移';

  @override
  String get play => '开始';

  @override
  String get settings => '设置';

  @override
  String get language => '语言';

  @override
  String get systemLanguage => '跟随系统';

  @override
  String get audio => '音频';

  @override
  String get mute => '静音';

  @override
  String get musicVolume => '音乐音量';

  @override
  String get sfxVolume => '音效音量';

  @override
  String get back => '返回';

  @override
  String get score => '得分';

  @override
  String get languageNameEn => 'English';

  @override
  String get languageNameZhHans => '简体中文';

  @override
  String get languageNameJa => '日本語';

  @override
  String get languageNameKo => '한국어';

  @override
  String get languageNameTh => 'ไทย';

  @override
  String get languageNameId => 'Bahasa Indonesia';
}

/// The translations for Chinese, using the Han script (`zh_Hans`).
class AppLocalizationsZhHans extends AppLocalizationsZh {
  AppLocalizationsZhHans() : super('zh_Hans');

  @override
  String get appTitle => '节拍漂移';

  @override
  String get play => '开始';

  @override
  String get settings => '设置';

  @override
  String get language => '语言';

  @override
  String get systemLanguage => '跟随系统';

  @override
  String get audio => '音频';

  @override
  String get mute => '静音';

  @override
  String get musicVolume => '音乐音量';

  @override
  String get sfxVolume => '音效音量';

  @override
  String get back => '返回';

  @override
  String get score => '得分';

  @override
  String get languageNameEn => 'English';

  @override
  String get languageNameZhHans => '简体中文';

  @override
  String get languageNameJa => '日本語';

  @override
  String get languageNameKo => '한국어';

  @override
  String get languageNameTh => 'ไทย';

  @override
  String get languageNameId => 'Bahasa Indonesia';
}
