import 'dart:async';
import 'dart:collection';

import 'package:flame_audio/flame_audio.dart';
import 'package:flutter/services.dart';

abstract interface class AudioController {
  Future<void> init();
  void setMusicVolume(double value);
  void setSfxVolume(double value);
  void setMuted({required bool isMuted});
  Future<void> playBgm(String assetPath);
  Future<void> stopBgm();
  Future<void> pause();
  Future<void> resume();
  Future<void> playSfx(String assetPath);
  Future<void> dispose();
}

class FlameAudioController implements AudioController {
  double _musicVolume = 0.8;
  double _sfxVolume = 0.9;
  bool _isMuted = false;

  final Map<String, AudioPool> _pools = HashMap();

  @override
  Future<void> init() async {
    try {
      await FlameAudio.bgm.initialize().timeout(const Duration(seconds: 2));
      FlameAudio.bgm.audioPlayer.setVolume(_effectiveMusicVolume);
    } on MissingPluginException {
      return;
    } on TimeoutException {
      return;
    }
  }

  @override
  void setMusicVolume(double value) {
    _musicVolume = value.clamp(0.0, 1.0);
    try {
      FlameAudio.bgm.audioPlayer.setVolume(_effectiveMusicVolume);
    } on MissingPluginException {
      return;
    }
  }

  @override
  void setSfxVolume(double value) {
    _sfxVolume = value.clamp(0.0, 1.0);
  }

  @override
  void setMuted({required bool isMuted}) {
    _isMuted = isMuted;
    try {
      FlameAudio.bgm.audioPlayer.setVolume(_effectiveMusicVolume);
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> playBgm(String assetPath) async {
    if (_isMuted) {
      return;
    }
    try {
      await FlameAudio.bgm.play(assetPath, volume: _effectiveMusicVolume);
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> stopBgm() async {
    try {
      await FlameAudio.bgm.stop();
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> pause() async {
    try {
      await FlameAudio.bgm.pause();
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> resume() async {
    if (_isMuted) {
      return;
    }
    try {
      await FlameAudio.bgm.resume();
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> playSfx(String assetPath) async {
    if (_isMuted) {
      return;
    }
    try {
      final pool = await _getOrCreatePool(assetPath);
      await pool.start(volume: _effectiveSfxVolume);
    } on MissingPluginException {
      return;
    }
  }

  @override
  Future<void> dispose() async {
    try {
      await FlameAudio.bgm.stop();
    } on MissingPluginException {
      return;
    }
    for (final pool in _pools.values) {
      pool.dispose();
    }
    _pools.clear();
  }

  double get _effectiveMusicVolume => _isMuted ? 0.0 : _musicVolume;
  double get _effectiveSfxVolume => _isMuted ? 0.0 : _sfxVolume;

  Future<AudioPool> _getOrCreatePool(String assetPath) async {
    final existing = _pools[assetPath];
    if (existing != null) {
      return existing;
    }
    final pool = await FlameAudio.createPool(assetPath, maxPlayers: 3);
    _pools[assetPath] = pool;
    return pool;
  }
}
