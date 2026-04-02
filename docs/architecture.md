# アーキテクチャ設計書 (Architecture Design Document)

## 前提と方針

- 本プロジェクトは React Native + Expo managed workflow + JavaScript を前提にする
- Node.js 22 と Expo SDK 54 を固定前提とし、自動アップグレードを行わない
- MVP はオフラインで完結する単一モバイルクライアントとして設計する
- 写真は端末上の参照 URI を保持し、アプリ内へ重複コピーしない
- 音声、位置情報、ローカル DB などの端末依存処理は明確に Platform Layer へ分離する
- 品質確認は `npm run lint`、`npm test`、`npx expo start` を基本とする

## テクノロジースタック

### 言語・ランタイム

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | 22.x | ローカル開発環境 |
| JavaScript | ES2022 | アプリ実装 |
| npm | 10.x 系想定 | パッケージ管理 |

### フレームワーク・ライブラリ

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| React Native | Expo SDK 54 対応版 | モバイル UI | iOS / Android 共通の UI 基盤として扱える |
| Expo | SDK 54 | 実行基盤・端末機能 | managed workflow でネイティブ設定負荷を抑えられる |
| React | Expo 同梱版 | 宣言的 UI | 画面と状態の分離がしやすい |
| React Navigation | Expo SDK 54 対応版 | タブ / スタック遷移 | Timeline / Map の 2 タブと詳細遷移に適している |
| `expo-image-picker` | Expo SDK 54 対応版 | 写真選択 | Camera / Library 導線を統一的に扱える |
| `expo-camera` | Expo SDK 54 対応版 | 将来のアプリ内撮影 | 追加撮影をアプリ内に取り込む余地を残せる |
| `expo-location` | Expo SDK 54 対応版 | 位置情報取得 | EXIF が不足する場合の GPS フォールバックとして使える |
| `expo-av` | Expo SDK 54 対応版 | 音声録音・再生 | 音声メモの録音と再生を一元化できる |
| `expo-sqlite` | Expo SDK 54 対応版 | ローカル永続化 | Entry と Photo のメタデータを軽量に保持できる |
| `react-native-maps` | Expo SDK 54 対応版 | 地図表示 | イベントの場所ベース閲覧を支える |
| `react-native-image-viewing` | 0.2.x | full-screen 写真 lightbox | EntryDetail で横スワイプ、ピンチズーム、swipe-to-close を managed workflow のまま扱うため |

### 開発ツール

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| ESLint | 現行メジャー | 静的解析 | JavaScript プロジェクトでの規約統一に使う |
| Jest | 29.x | test runner | Expo SDK 54 と互換性のあるテスト実行基盤として使う |
| `jest-expo` | 54.x 対応版 | Expo / React Native test preset | Expo 環境のモジュール解決とモックを安定して扱える |
| `@testing-library/react-native` | React Native 対応版 | component test | 実ユーザー操作に近いテストが書ける |
| Prettier | 現行メジャー | コード整形 | 書式差分を減らしてレビュー効率を保つ |

## アーキテクチャパターン

### Feature-first + Layered Client Architecture

```text
UI Layer
  screens / components
Application Layer
  hooks / controllers / use cases
Domain Layer
  entities / selectors / validators / title rules
Platform Layer
  repositories / Expo services / local file access / SQLite
```

### レイヤー定義

#### UI Layer
- **責務**: 画面描画、ユーザー入力受付、表示状態の切り替え
- **許可される操作**: hook / controller の呼び出し、UI コンポーネント合成
- **禁止される操作**: Expo API の直接呼び出し、SQL 実行、タイトル生成ルール実装

#### Application Layer
- **責務**: 画面単位の状態遷移、非同期フローの順序制御、保存可否判定
- **許可される操作**: Domain Layer と Platform Layer の組み合わせ
- **禁止される操作**: JSX の詳細描画、低レベルの SQLite / FileSystem 操作

#### Domain Layer
- **責務**: Entry / Photo のデータ契約、座標集約、タイトル生成、バリデーション、一覧整形
- **許可される操作**: 純粋関数、JSDoc で定義した型契約
- **禁止される操作**: React、Expo、`react-native-maps`、ファイルシステム依存

#### Platform Layer
- **責務**: 写真選択、録音、位置取得、SQLite 永続化、音声ファイル保存
- **許可される操作**: Expo / React Native 公式 API の利用
- **禁止される操作**: UI ルールやドメイン意思決定の埋め込み

## データ管理

| データ種別 | 保存場所 | フォーマット | 理由 |
|-----------|----------|-------------|------|
| Entry メタデータ | SQLite | テーブル (`entries`) | 一覧・詳細・更新の高速取得とオフライン永続化のため |
| Photo メタデータ | SQLite | テーブル (`photos`) | 複数写真、順序、EXIF 座標をイベント単位で管理するため |
| 音声ファイル | アプリ専用領域 | `.m4a` など | Camera Roll と分けて管理し、再生制御しやすくするため |
| 写真本体 | 端末写真ライブラリ | URI 参照 | 重複コピーを避け、端末ストレージ消費を抑えるため |
| 画面状態 | メモリ | JavaScript オブジェクト | 入力中の一時状態を高速に扱うため |
| 将来の同期キュー | SQLite | テーブル (`sync_queue`) | P1 のバックアップ同期に備えて拡張可能にするため |

## オフライン戦略

- MVP の必須機能はネットワーク非依存で利用できる設計にする
- 保存処理はローカル完結とし、通信確認を待たない
- 写真 EXIF に座標がない場合は端末位置情報を試し、それも失敗したら `位置なし` で保存する
- 音声録音や位置情報取得が失敗しても、写真を中心としたイベント作成フローは継続させる
- 将来のバックアップ同期は非同期で追加し、保存完了条件に含めない

## テスト戦略

### unit test
- **実行手段**: `npm test`
- **対象**: タイトル生成、位置集約、バリデーション、タイムライン整形、地図ピン生成

### component test
- **実行手段**: `npm test`
- **対象**: AddEntry の主要フロー、Timeline / Map / Detail の画面遷移、権限エラー時の代替 UI

### 起動確認
- **実行手段**: `npx expo start`
- **対象**: Expo 起動、2 タブ構成、イベント作成から詳細表示までの主要フロー

### 静的解析
- **実行手段**: `npm run lint`
- **対象**: 命名規則、未使用コード、hooks ルール、import 境界

## パフォーマンス要件

| 項目 | 目標 | 測定条件 |
|------|------|---------|
| コールドスタート | 2.5 秒以内に Timeline 初期 UI を表示 | 代表的な開発端末、イベント 200 件 |
| イベント保存 | 3 秒以内 | 写真 5 枚 + 音声 30 秒の通常ケース |
| 地図初期描画 | 2 秒以内 | 位置付きイベント 300 件 |
| 音声再生開始 | 500ms 以内 | ローカル保存済み音声ファイル |

## セキュリティ / 品質制約

- 写真、マイク、位置情報以外の不要な権限は要求しない
- ログやクラッシュレポートに個人の位置座標や生ファイル URI を直接出さない
- 保存成功後にアプリを終了しても、SQLite と音声ファイルの整合性が崩れないようにする
- 例外発生時はアプリ全体を落とさず、画面単位で recoverable error として扱う

## 技術的制約

- Expo managed workflow の範囲で完結する実装を優先する
- TypeScript は導入しない
- Expo SDK と Node バージョンは明示依頼なしで変更しない
- Expo 関連依存の追加は `npx expo install` を用いる
- 1 イベントあたり音声は 1 件までとする
- Mac mini 同期サーバーは P1 範囲とし、現リポジトリの MVP 実装境界に含めない

## 依存関係管理

| ライブラリ | 用途 | 管理方針 |
|-----------|------|---------|
| React Native / Expo | 実行基盤 | Expo SDK 54 互換性を最優先して管理する |
| Expo modules | 写真、音声、位置、SQLite | 追加時は `npx expo install` を使い、SDK 互換版を採用する |
| React Navigation | 画面遷移 | Expo 互換性を維持して更新する |
| `react-native-image-viewing` | full-screen 写真 viewer | Expo managed workflow と Detail 画面責務の整合を崩さない範囲で管理する |
| Jest | test runner | `jest-expo` と整合するメジャーを維持する |
| `jest-expo` | Expo test preset | Expo SDK 54 互換性を優先して管理する |
| `@testing-library/react-native` | component test | React Native 互換性を優先して管理する |

## 確認チェックリスト

- [x] React Native + Expo + JavaScript の前提が明記されている
- [x] UI / Application / Domain / Platform の責務が分かれている
- [x] `npm run lint` / `npm test` / `npx expo start` が確認手順に含まれている
- [x] オフライン前提と端末依存処理の扱いが記述されている
