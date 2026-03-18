# アーキテクチャ設計ガイド

## 目的

`docs/architecture.md` は、PRD と機能設計を React Native + Expo + JavaScript でどう成立させるかを説明するドキュメントです。  
実装ファイルの一覧ではなく、技術判断の理由と境界を明文化してください。

## このプロジェクトで固定する前提

- アプリは React Native + Expo で実装する
- 実装言語は JavaScript を前提にする
- MVP はオフライン完結の単一クライアントアプリ
- 品質確認の基本コマンドは `npm run lint`、`npm test`、`npx expo start`

## 書くべき内容

### 1. 前提と方針

- どの体験を最優先に守るか
- どの制約を持つか
- なぜその技術を選ぶか

### 2. テクノロジースタック

最低でも次を明記します。

- Node.js / npm
- JavaScript (ES2022)
- React Native
- Expo
- ESLint
- Vitest
- `@testing-library/react-native`

ツール名だけで終わらせず、用途と採用理由を書くこと。

### 3. レイヤー構造

少なくとも以下の境界を分けます。

- UI Layer: `screens` / `components`
- Application Layer: `hooks` / `controllers`
- Domain Layer: ゲームルール、selector、純粋関数
- Platform Layer: 音、振動、ローカル保存

各レイヤーごとに以下を必ず書きます。

- 責務
- 許可される依存
- 禁止される依存

### 4. データ管理

MVP がメモリのみで十分か、将来ローカル保存が必要かを明記します。  
アセットはオフライン前提で同梱する方針を記述してください。

### 5. テスト戦略

アーキテクチャ書では、テスト対象をレイヤーに対応づけます。

- unit test: Domain Layer
- component test: UI + Application Layer
- 起動確認: Expo 起動と主要フロー

コマンドは次を基準に記載します。

```bash
npm run lint
npm test
npx expo start
```

### 6. 技術的制約

次のような制約は必ず残します。

- オフライン必須
- 子供向け UX 優先
- 不要な権限を要求しない
- Expo 管理ワークフローで完結させる

## 書き方のコツ

### 良い記述

- 「Expo を採用する。音と振動を公式モジュールで扱え、初期実装のネイティブ設定を減らせる」
- 「Platform Layer の失敗はゲーム進行を止めず、失敗時はフォールバックする」

### 避ける記述

- 「最新技術だから使う」
- 「あとで考える」
- 「必要になったら調整する」

## 推奨の章立て

1. 前提と方針
2. テクノロジースタック
3. アーキテクチャパターン
4. データ管理
5. オフライン戦略
6. テスト戦略
7. 技術的制約
8. 依存関係管理

## 完成チェック

- [ ] React Native + Expo + JavaScript の前提が書かれている
- [ ] UI / Application / Domain / Platform の境界が説明されている
- [ ] `npm run lint` / `npm test` / `npx expo start` が確認手順に含まれている
- [ ] オフライン方針と端末依存処理の扱いが書かれている
- [ ] 将来拡張と MVP の切り分けができている
