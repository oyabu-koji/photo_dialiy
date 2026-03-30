# プロジェクト用語集 (Glossary)

## 概要

このドキュメントは、プロジェクト内で使用される用語の定義を管理します。

**更新日**: 2026-03-25

## ドメイン用語

### Photo Diary

**定義**: 本プロジェクトのアプリ名称。

**説明**: 写真と音声を中心にイベント単位で思い出を残すライフログアプリを指す。

**関連用語**: Memory Log, Event, Entry

**使用例**:
- Photo Diary で旅行の思い出を残す
- Photo Diary の Timeline から過去イベントを振り返る

**英語表記**: Photo Diary

### Memory Log

**定義**: 写真、音声、位置情報、日時を組み合わせた記憶記録の概念。

**説明**: ユーザー価値を表す言葉であり、実装上の単一テーブル名ではない。

**関連用語**: Event, Entry

**使用例**:
- 写真だけでなく音声を添えて Memory Log を残す

**英語表記**: Memory Log

### Event

**定義**: ユーザーが 1 つの出来事として認識する記録単位。

**説明**: UI 上では「イベント」と呼び、内部データモデルでは `Entry` が対応する。

**関連用語**: Entry, Timeline, EntryDetail

**使用例**:
- 動物園に行った日の写真 3 枚と音声 1 件を 1 Event として保存する

**英語表記**: Event

### Entry

**定義**: Event を保存するための内部エンティティ。

**説明**: タイトル、日時、位置、音声パス、サムネイルなどを保持する。

**関連用語**: PhotoAsset, syncStatus

**使用例**:
- `entries` テーブルへ Entry を保存する

**英語表記**: Entry

### PhotoAsset

**定義**: イベントに紐づく写真参照データ。

**説明**: 端末ライブラリ上の `localUri`、EXIF 由来の位置、撮影時刻、表示順序を持つ。

**関連用語**: Entry, coverPhotoUri

**使用例**:
- 先頭の PhotoAsset をカバー画像として使う

**英語表記**: Photo Asset

### Voice Note

**定義**: Event に 1 件だけ紐づけられる音声メモ。

**説明**: 感情や状況を短く補足する録音データで、アプリ専用領域へ保存する。

**関連用語**: voicePath, AddEntry

**使用例**:
- 写真を選んだ後に Voice Note を録音して保存する

**英語表記**: Voice Note

### Timeline

**定義**: Event を時系列に一覧表示する画面と体験。

**説明**: サムネイル、タイトル、日付、位置名を主要情報として表示する。

**関連用語**: EntryListScreen, EntryDetailScreen

**使用例**:
- Timeline から先週の家族イベントを開く

**英語表記**: Timeline

## 技術用語

### Expo

**定義**: React Native アプリの開発・実行を支援するプラットフォーム。

**公式サイト**: https://expo.dev/

**本プロジェクトでの用途**: 実行基盤、画像取得、録音、位置情報、SQLite などの端末機能利用。

**バージョン方針**: SDK 54 固定前提。明示依頼なしでアップグレードしない。

**関連ドキュメント**: `docs/architecture.md`

### React Native

**定義**: JavaScript でネイティブモバイル UI を構築するフレームワーク。

**公式サイト**: https://reactnative.dev/

**本プロジェクトでの用途**: iOS / Android 向け UI 実装。

**バージョン方針**: Expo SDK 54 互換版を採用。

**関連ドキュメント**: `docs/architecture.md`

### SQLite

**定義**: 組み込み型の軽量リレーショナルデータベース。

**公式サイト**: https://www.sqlite.org/

**本プロジェクトでの用途**: Entry と PhotoAsset のローカル永続化。

**バージョン方針**: Expo SDK 54 互換の `expo-sqlite` を利用。

**関連ドキュメント**: `docs/functional-design.md`, `docs/architecture.md`

### JSDoc

**定義**: JavaScript コードにデータ契約や関数契約を注記するための記法。

**公式サイト**: https://jsdoc.app/

**本プロジェクトでの用途**: TypeScript を導入しない代わりに、主要データモデルと API 契約を明文化する。

**バージョン方針**: 標準記法を採用し、再利用構造には typedef を定義する。

**関連ドキュメント**: `docs/development-guidelines.md`

### Jest

**定義**: JavaScript 向けのテストランナー。

**公式サイト**: https://jestjs.io/

**本プロジェクトでの用途**: `npm test` の実行基盤として unit test と component test を動かす。

**バージョン方針**: `jest-expo` と整合するバージョンを維持する。

**関連ドキュメント**: `docs/architecture.md`, `docs/functional-design.md`

## 略語・頭字語

### MVP

**正式名称**: Minimum Viable Product

**意味**: 最小限の価値検証が可能な初期リリース範囲。

**本プロジェクトでの使用**: オフラインでイベント作成、一覧、地図、詳細閲覧ができるモバイルアプリ範囲を指す。

### EXIF

**正式名称**: Exchangeable Image File Format

**意味**: 写真ファイルが持つ撮影時刻や位置などのメタデータ。

**本プロジェクトでの使用**: イベント位置や撮影日時の初期値計算に利用する。

### PRD

**正式名称**: Product Requirements Document

**意味**: プロダクト要求定義書。

**本プロジェクトでの使用**: `docs/product-requirements.md` を指す。

## アーキテクチャ用語

### UI Layer

**定義**: 画面描画とユーザー入力受付を担当する層。

**本プロジェクトでの適用**: `screens/` と `components/` が属する。

**関連コンポーネント**: `EntryListScreen`, `MapScreen`, `AddEntryScreen`, `EntryDetailScreen`

### Application Layer

**定義**: 状態遷移、非同期フロー制御、ユースケース調停を担当する層。

**本プロジェクトでの適用**: `hooks/` や controller 相当が属する。

**関連コンポーネント**: `useAddEntryForm`, `useEntryTimeline`, `useEntryMap`

### Domain Layer

**定義**: React や Expo に依存しない純粋なルールとデータ契約を扱う層。

**本プロジェクトでの適用**: タイトル生成、位置計算、入力検証、一覧整形が属する。

**関連コンポーネント**: `createEntryTitle`, `resolveEntryCoordinates`, `validateEntryDraft`

### Platform Layer

**定義**: Expo API、SQLite、ローカルファイルなど端末依存処理を扱う層。

**本プロジェクトでの適用**: `services/` と `repositories/` が属する。

**関連コンポーネント**: `photoPickerService`, `voiceRecorderService`, `entryRepository`

## ステータス・状態

### AddEntryStatus

| ステータス | 意味 | 遷移条件 | 次の状態 |
|----------|------|---------|---------|
| `idle` | 画面初期状態 | 画面表示直後 | `loadingAssets`, `editing` |
| `loadingAssets` | 写真取得と位置解決中 | 写真選択開始 | `editing`, `error` |
| `editing` | 写真と音声の編集が可能 | 写真取得完了または録音停止後 | `recording`, `saving` |
| `recording` | 音声録音中 | 録音開始 | `editing`, `error` |
| `saving` | ローカル保存処理中 | 保存開始 | `saved`, `error` |
| `saved` | 保存完了 | 保存成功 | 画面離脱 |
| `error` | recoverable error 発生 | 保存失敗など | `editing` |

### EntrySyncStatus

| ステータス | 意味 | 遷移条件 | 次の状態 |
|----------|------|---------|---------|
| `localOnly` | 端末内のみ保存済み | MVP の保存直後 | `pendingSync` |
| `pendingSync` | 将来同期待ち | P1 の同期キュー投入後 | `synced`, `syncFailed` |
| `synced` | バックアップ同期済み | 同期成功 | - |
| `syncFailed` | 同期失敗 | 同期エラー発生 | `pendingSync` |

## データモデル用語

### Entry

**定義**: Event の主要メタデータを表すエンティティ。

**主要フィールド**:
- `id`: Entry 識別子
- `title`: 自動生成または編集済みタイトル
- `coverPhotoUri`: 一覧やカード表示で使う代表写真 URI
- `photoCount`: イベントに紐づく写真枚数
- `createdAt`: レコード作成日時
- `updatedAt`: 最終更新日時
- `eventDate`: イベント日付
- `lat` / `lng`: 代表座標
- `placeName`: 表示用地名
- `voicePath`: 音声ファイルパス
- `syncStatus`: 将来同期に備えた状態

**関連エンティティ**: PhotoAsset

**実装例**: `src/features/entries/types/entry.types.js`

### EntryDetailAggregate

**定義**: 詳細画面表示と編集モード初期化で使う集約データ。

**主要フィールド**:
- `entry`: `Entry` 本体
- `photos`: イベントに紐づく `PhotoAsset[]`

**関連エンティティ**: Entry, PhotoAsset

**実装例**: `src/features/entries/types/entry.types.js`

## エラー・例外

### ValidationError

**クラス名**: `ValidationError`

**発生条件**: 写真未選択で保存を試みた場合や、必須フィールドが欠けた場合。

**対処方法**: 保存を止め、ユーザーへ不足入力を示す。

**例**:
```javascript
throw new ValidationError('at least one photo is required');
```

### PermissionDeniedError

**クラス名**: `PermissionDeniedError`

**発生条件**: 写真、マイク、位置情報の権限が拒否された場合。

**対処方法**: 設定画面導線や代替フローを表示し、使えない機能のみ制限する。

**例**:
```javascript
throw new PermissionDeniedError('microphone permission denied');
```

## テスト関連用語

### unit test

**定義**: 純粋ロジックや変換処理を小さな単位で検証するテスト。

**本プロジェクトでの使用**: タイトル生成、位置計算、バリデーション、一覧整形などを対象にする。

**関連コマンド**:
- `npm run lint`
- `npm test`
- `npx expo start`

### component test

**定義**: React Native 画面や UI コンポーネントの振る舞いを確認するテスト。

**本プロジェクトでの使用**: AddEntry、Timeline、Map、Detail の主要フローを対象にする。

**関連コマンド**:
- `npm test`
- `npx expo start`
