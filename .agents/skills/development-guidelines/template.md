# 開発ガイドライン (Development Guidelines)

## 基本原則

- [ユーザー体験の最優先事項]
- [オフライン前提や権限制約]
- [docs と `.steering` を同期する運用方針]

## 開発環境

- Node.js: [22.x]
- npm: [10.x]
- JavaScript: [ES2022]
- 実行基盤: React Native + Expo

### 日常コマンド

```bash
npm run lint
npm test
npx expo start
```

## コーディング規約

### JavaScript / JSDoc

```javascript
/**
 * @typedef {Object} [EntityName]
 * @property {string} id
 * @property {string} name
 */
```

- 公開される関数、hook、service の契約は JSDoc で補う
- 状態名と制約は設計書と揃える

### 命名規則

```javascript
const selectedCardIds = [];

function createDeck() {
  return [];
}

function useGameSession() {
  return {};
}

function GameScreen() {
  return <View />;
}
```

- 変数 / 関数: `camelCase`
- コンポーネント: `PascalCase`
- hook: `use` で始める
- 真偽値: `is` / `has` / `can` / `should`

### ファイル規約

- 画面: `PascalCaseScreen.jsx`
- コンポーネント: `PascalCase.jsx`
- hook / service / util: `camelCase.js`
- test: `*.test.js` / `*.test.jsx`

### エラーハンドリング

```javascript
class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}
```

- 入力不正は明示的なエラーにする
- 端末依存処理の失敗は recoverable error として扱う

## UI / 実装ルール

- 画面から Expo API を直接呼ばない
- 端末依存処理は `services/` に集約する
- 状態遷移は hook または controller に集約する
- 子供向け UI では長文説明より視覚フィードバックを優先する

## テスト戦略

### unit test
- [対象]
- [対象]

### component test
- [対象]
- [対象]

### 起動確認
- `npx expo start` で主要画面が起動する
- [必要な実機確認]

## 品質ゲート

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npx expo start`
- [ ] 必要な `docs/` / `.steering/` 更新

## Git 運用

- ブランチ戦略: [方針]
- コミット規約: Conventional Commits
- PR 前チェック: [項目]

## Definition of Done

- [ ] 受け入れ条件を満たす
- [ ] lint / test / 起動確認が完了している
- [ ] ドキュメントが同期している
