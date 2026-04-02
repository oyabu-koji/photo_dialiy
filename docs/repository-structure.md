# リポジトリ構造定義書 (Repository Structure Document)

## 適用方針

- 本リポジトリは React Native + Expo + JavaScript を前提にする
- Expo エントリーポイントは `App.jsx` とする
- UI は `.jsx`、hook / service / logic / repository は `.js` を基本とする
- feature-first 構成を採用し、イベント関連と地図関連を feature 単位で分離する
- 品質確認は `npm run lint`、`npm test`、`npx expo start` を基本とする
- 現在のリポジトリはテンプレート段階だが、本書は `init-project` 後の目標構造を定義する

## プロジェクト構造

```text
project-root/
├── App.jsx
├── assets/
│   ├── icons/
│   ├── images/
│   └── audio/
├── src/
│   ├── app/
│   │   ├── navigation/
│   │   ├── providers/
│   │   └── theme/
│   ├── features/
│   │   ├── entries/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── logic/
│   │   │   ├── repositories/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── __tests__/
│   │   └── map/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── logic/
│   │       ├── screens/
│   │       └── __tests__/
│   └── shared/
│       ├── components/
│       ├── constants/
│       ├── test-support/
│       └── utils/
├── tests/
│   └── e2e/
├── docs/
├── .agents/
├── .steering/
├── package.json
├── eslint.config.js
└── jsconfig.json
```

## ディレクトリ詳細

### `assets/`

**役割**: アプリアイコン、プレースホルダー画像、将来の UI 効果音などの静的アセットを配置する

**配置ファイル**:
- `icons/`
- `images/`
- `audio/`

**命名規則**:
- `kebab-case`

### `src/app/`

**役割**: アプリ全体のナビゲーション、プロバイダ、テーマ定義を配置する

**配置ファイル**:
- `navigation/AppNavigator.jsx`
- `providers/`
- `theme/`

**依存関係**:
- 依存可能: `features/`, `shared/`
- 依存禁止: `tests/`

### `src/features/entries/screens/`

**役割**: `EntryListScreen`、`AddEntryScreen`、`EntryDetailScreen` を配置する

**配置ファイル**:
- `EntryListScreen.jsx`
- `AddEntryScreen.jsx`
- `EntryDetailScreen.jsx`

**命名規則**:
- `PascalCaseScreen.jsx`

**依存関係**:
- 依存可能: `components/`, `hooks/`, `shared/`
- 依存禁止: Expo API の直接利用、`map/logic/` の直接参照

### `src/features/entries/components/`

**役割**: 写真ストリップ、音声コントロール、一覧カードなど、イベント feature 専用 UI を配置する

**配置ファイル**:
- `EntryCard.jsx`
- `EntryLocationMapPreview.jsx`
- `EntryPhotoLightboxModal.jsx`
- `PhotoCarousel.jsx`
- `PhotoStrip.jsx`
- `VoicePlayer.jsx`
- `VoiceRecorderPanel.jsx`

**命名規則**:
- `PascalCase.jsx`

**依存関係**:
- 依存可能: `shared/`, `types/`
- 依存禁止: `screens/`, `repositories/`

### `src/features/entries/hooks/`

**役割**: イベント feature の状態遷移と非同期処理を管理する

**配置ファイル**:
- `useEntryTimeline.js`
- `useAddEntryForm.js`
- `useEntryDetail.js`

**命名規則**:
- `use` で始める

**依存関係**:
- 依存可能: `logic/`, `repositories/`, `services/`, `types/`
- 依存禁止: `screens/`

### `src/features/entries/logic/`

**役割**: タイトル生成、位置計算、入力検証などの純粋関数を配置する

**配置ファイル**:
- `buildLightboxImages.js`
- `createEntryTitle.js`
- `resolveEntryCoordinates.js`
- `validateEntryDraft.js`

**命名規則**:
- `camelCase.js`

**依存関係**:
- 依存可能: `types/`, `src/shared/utils/`
- 依存禁止: React、Expo、SQLite、ファイルシステム

### `src/features/entries/repositories/`

**役割**: SQLite を用いた Entry / Photo 永続化を担当する

**配置ファイル**:
- `entryRepository.js`
- `entryMappers.js`

**命名規則**:
- `camelCase.js`

**依存関係**:
- 依存可能: `services/`, `types/`, Expo SQLite
- 依存禁止: `screens/`, 画面文言の定義

### `src/features/entries/services/`

**役割**: 画像選択、録音、位置解決など Expo 依存処理を集約する

**配置ファイル**:
- `photoPickerService.js`
- `voiceRecorderService.js`
- `locationResolverService.js`

**命名規則**:
- `camelCase.js`

**依存関係**:
- 依存可能: Expo / React Native 公式 API
- 依存禁止: `screens/`, ドメインルールの実装

### `src/features/entries/types/`

**役割**: JSDoc 補助や状態定数をまとめる

**配置ファイル**:
- `entry.types.js`
- `entryStatus.js`

**命名規則**:
- `*.types.js`, `camelCase.js`

### `src/features/entries/__tests__/`

**役割**: entries feature の unit test / component test を配置する

**配置ファイル**:
- `EntryPhotoLightboxModal.test.jsx`
- `useAddEntryForm.test.js`
- `EntryDetailScreen.test.jsx`
- `EntryListScreen.test.jsx`
- `PhotoCarousel.test.jsx`

**命名規則**:
- `*.test.js` / `*.test.jsx`

### `src/features/map/`

**役割**: MapScreen と地図ピン関連ロジックを独立 feature として配置する

**配置ファイル**:
- `screens/MapScreen.jsx`
- `components/EntryMapView.jsx`
- `hooks/useEntryMap.js`
- `logic/buildMapPins.js`

**依存関係**:
- 依存可能: `src/features/entries/repositories/`, `src/shared/`
- 依存禁止: `src/features/entries/screens/`

### `src/shared/`

**役割**: 複数 feature で再利用する UI、定数、ユーティリティ、テスト補助を配置する

**配置ファイル**:
- `components/`
- `constants/`
- `utils/`
- `test-support/`

## ファイル配置規則

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| 画面 | `screens/` | `PascalCaseScreen.jsx` | `AddEntryScreen.jsx` |
| コンポーネント | `components/` | `PascalCase.jsx` | `EntryCard.jsx` |
| hook | `hooks/` | `useSomething.js` | `useEntryMap.js` |
| repository | `repositories/` | `camelCase.js` | `entryRepository.js` |
| service | `services/` | `camelCase.js` | `voiceRecorderService.js` |
| util / logic | `logic/`, `utils/` | `camelCase.js` | `createEntryTitle.js` |
| JSDoc 定義補助 | `types/` | `*.types.js` | `entry.types.js` |
| test | `__tests__/` | `*.test.jsx` / `*.test.js` | `MapScreen.test.jsx` |

## 依存関係ルール

```text
screens -> hooks -> logic
screens -> hooks -> repositories
hooks -> services
repositories -> services
components -> shared
services -> Expo / React Native API
logic -> shared/utils
```

**禁止例**:
- `logic/` から Expo API を呼ぶ
- `components/` が `screens/` を import する
- `shared/` に feature 固有の Entry 定義や Map 表示仕様を持ち込む
- `map/` が `entries/screens/` を直接参照する

## テスト / 起動確認

```bash
npm run lint
npm test
npx expo start
```

## 実機確認の記録先

- `.steering/[YYYYMMDD]-[task]/tasklist.md`
