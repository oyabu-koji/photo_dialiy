# アーキテクチャ設計書 (Architecture Design Document)

## 前提と方針

- 本プロジェクトは React Native + Expo + JavaScript を前提にする
- MVP は単一のオフラインクライアントとして設計する
- 画面描画、ゲームロジック、端末依存処理の境界を明確にする
- 品質確認は `npm run lint`、`npm test`、`npx expo start` を基本とする

## テクノロジースタック

### 言語・ランタイム

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | [22.x] | 開発環境 |
| JavaScript | [ES2022] | アプリ実装 |
| npm | [10.x] | パッケージ管理 |

### フレームワーク・ライブラリ

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| React Native | [Expo対応版] | モバイルUI | [理由] |
| Expo | [安定版] | 実行基盤・端末機能 | [理由] |
| React | [Expo同梱版] | 宣言的UI | [理由] |
| [追加ライブラリ] | [版] | [用途] | [理由] |

### 開発ツール

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| ESLint | [版] | 静的解析 | [理由] |
| Vitest | [版] | unit test | [理由] |
| `@testing-library/react-native` | [版] | component test | [理由] |
| Prettier | [版] | 整形 | [理由] |

## アーキテクチャパターン

### Feature-first + Layered Client Architecture

```text
UI Layer
  screens / components
Application Layer
  hooks / controllers
Domain Layer
  game rules / selectors
Platform Layer
  audio / haptics / storage
```

### レイヤー定義

#### UI Layer
- **責務**: 画面描画、タップイベント受付、表示制御
- **許可される操作**: hook / controller の呼び出し
- **禁止される操作**: 端末APIの直接利用、ゲームルールの実装

#### Application Layer
- **責務**: 状態遷移の調停、非同期演出の順序制御
- **許可される操作**: Domain / Platform Layer の呼び出し
- **禁止される操作**: JSX の描画詳細を持つこと

#### Domain Layer
- **責務**: デッキ生成、判定、selector、入力ガード
- **許可される操作**: 純粋関数、JSDoc で記述したデータ契約への依存
- **禁止される操作**: React、Expo、画面依存

#### Platform Layer
- **責務**: 音、振動、将来のローカル保存
- **許可される操作**: Expo / React Native 公式 API の利用
- **禁止される操作**: ゲームルールの意思決定

## データ管理

| データ種別 | 保存場所 | フォーマット | 理由 |
|-----------|----------|-------------|------|
| ゲーム進行状態 | メモリ | JavaScript オブジェクト | [理由] |
| 画像・音声アセット | アプリ同梱 | PNG / WebP / MP3 等 | [理由] |
| 将来の設定値 | ローカル保存予定 | JSON 相当 | [理由] |

## オフライン戦略

- 外部 API やクラウド依存を持たない
- 必須アセットはすべて同梱する
- 端末 API が一部使えなくてもゲーム進行は継続させる

## テスト戦略

### unit test
- **実行手段**: `npm test`
- **対象**: 純粋関数、selector、入力ガード

### component test
- **実行手段**: `npm test`
- **対象**: 画面遷移、主要な状態変化、タップ可否

### 起動確認
- **実行手段**: `npx expo start`
- **対象**: 画面が起動すること、主要フローを確認できること

### 静的解析
- **実行手段**: `npm run lint`
- **対象**: 命名、import、未使用コード、hooks ルール

## パフォーマンス要件

| 項目 | 目標 | 測定条件 |
|------|------|---------|
| 起動時間 | [目標] | [端末条件] |
| タップ反応 | [目標] | [端末条件] |
| メモリ使用量 | [目標] | [端末条件] |

## セキュリティ / 品質制約

- 個人情報を扱わない
- 不要な権限を要求しない
- ログやエラー表示に機密情報を含めない

## 技術的制約

- 縦向き前提 / 片手操作前提などの UI 制約を明記する
- Expo 管理ワークフローで完結する範囲を優先する
- 追加依存は標準機能で代替できない場合のみ採用する

## 依存関係管理

| ライブラリ | 用途 | 管理方針 |
|-----------|------|---------|
| React Native / Expo | 実行基盤 | Expo 互換性を優先して固定 |
| ESLint | 静的解析 | 現行メジャー内で管理 |
| Vitest | テスト | 現行メジャー内で管理 |
| `@testing-library/react-native` | component test | React Native 互換性を優先 |

## 確認チェックリスト

- [ ] React Native + Expo + JavaScript の前提が明記されている
- [ ] UI / Application / Domain / Platform の責務が分かれている
- [ ] `npm run lint` / `npm test` / `npx expo start` が確認手順に含まれている
- [ ] オフライン前提と端末依存処理の扱いが記述されている
