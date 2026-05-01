# TODO

## Phase 1 — 初始化 & Git 配置
- [x] Flutter SDK 安装（本地工具链）
- [x] Android SDK/BuildTools 配置
- [x] Flutter 工程初始化（beat_drift）
- [x] Lint 规则：flame_lint
- [x] .env.example 与启动校验器（APP_ENV）
- [x] 文档：README / ARCHITECTURE / GAME_DESIGN / ECONOMY / ASSET_PIPELINE

## Phase 2 — 核心脚手架
- [x] Flutter UI 壳：Home / Settings
- [x] i18n：EN / ZH-Hans / JA / KO / TH / ID（ARB + 切换）
- [x] Flame 桥接：GameWidget + BeatDriftGame
- [x] 音频抽象：AudioController 接口 + Flame 实现

## Verification
- [x] flutter analyze
- [x] flutter test
- [x] flutter build apk --release

## Next (Phase 3)
- [ ] 输入系统（单手拖拽/滑动 + 可选点击）
- [ ] 关卡/微关卡加载器与确定性生成
- [ ] 碰撞与失败/重试/暂停/恢复
- [ ] 本地存档结构与同步接口（Supabase）
