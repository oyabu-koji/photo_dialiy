# 開発ガイドライン (Development Guidelines)

## 基本原則

- 写真を中心に、最小入力でイベントを保存できる UX を最優先する
- オフライン前提のため、ネットワークの有無で主要フローを止めない
- `docs/` は恒久判断、`.steering/` はタスク単位の判断を管理し、変更時は両者を同期する
- React Native + Expo managed workflow + JavaScript を標準前提とし、TypeScript は導入しない
- Expo SDK と Node バージョンは明示依頼なしで変更しない
- Expo 関連依存の追加は `npx expo install` を使う

## 開発環境

- Node.js: 22.x
- npm: 10.x 系想定
- JavaScript: ES2022
- 実行基盤: React Native + Expo SDK 54

### 日常コマンド

```bash
npm run lint
npm test
npx expo start
```

### リモート端末確認

```bash
npx expo start --tunnel
```

## コーディング規約

### JavaScript / JSDoc

```javascript
/**
 * @typedef {Object} Entry
 * @property {string} id
 * @property {string} title
 * @property {string | null} voicePath
 * @property {'localOnly' | 'pendingSync' | 'synced' | 'syncFailed'} syncStatus
 */
```

- 公開される関数、hook、service、repository の契約は JSDoc で補う
- 状態名、エンティティ名、フィールド名は `docs/functional-design.md` と揃える
- 一時オブジェクトではなく、再利用される構造は名前付き typedef に切り出す
- TypeScript 的な厳密性が必要な箇所ほど JSDoc と test で補強する

### 命名規則

```javascript
const isRecording = false;
const selectedPhotoIds = [];

function createEntryTitle() {
  return '';
}

function useAddEntryForm() {
  return {};
}

function EntryListScreen() {
  return null;
}
```

- 変数 / 関数: `camelCase`
- コンポーネント: `PascalCase`
- hook: `use` で始める
- 真偽値: `is` / `has` / `can` / `should`
- SQLite テーブル名やローカル定数も、意味が伝わる命名を優先する

### ファイル規約

- 画面: `PascalCaseScreen.jsx`
- コンポーネント: `PascalCase.jsx`
- hook / service / repository / util: `camelCase.js`
- JSDoc 定義補助: `*.types.js`
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

- 入力不正や保存不可条件は明示的な `ValidationError` などで表現する
- 端末依存処理の失敗は recoverable error として扱い、イベント作成全体を即座に中断しない
- `catch` で続行する場合は、なぜ続行して安全かをコメントまたはログ方針で示す
- ログに個人情報、位置座標、生ファイル URI を直接残さない

## UI / 実装ルール

- 画面から Expo API を直接呼ばない
- 画像選択、録音、位置取得、SQLite は `services/` または `repositories/` に集約する
- 状態遷移は hook または controller に集約し、画面に複雑な分岐を持ち込まない
- `logic/` には純粋関数だけを置き、React や Expo に依存させない
- 写真はアプリ内へコピーせず、参照 URI を保持する
- 音声は 1 イベント 1 ファイルを基本とし、再録音時は古い一時ファイルの扱いを明確にする
- タイトルは自動生成を標準とし、手入力は補助操作として扱う

## テスト戦略

### unit test
- タイトル生成、位置計算、入力検証、一覧整形などの純粋ロジック
- SQLite mapper や DTO 変換ロジック

### component test
- AddEntry で写真選択から保存までの主要フロー
- Timeline / Map / Detail の画面遷移
- 権限拒否時や位置情報なし保存時の UI 挙動

### 起動確認
- `npx expo start` で主要画面が起動する
- Map、音声再生、権限周りを変えた場合はシミュレータまたは実機で一度触る
- リモート端末での確認が必要な場合は `npx expo start --tunnel` を使う

## 品質ゲート

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npx expo start`
- [ ] 必要な `docs/` / `.steering/` 更新
- [ ] 権限エラーやオフライン時の代替動線確認

## Git 運用

- ブランチ戦略: `main`, `develop`, `feature/<task>`, `fix/<task>`, `docs/<task>`
- コミット規約: Conventional Commits
- PR 前チェック:
  - 受け入れ条件を満たしている
  - `npm run lint` と `npm test` が通る
  - `npx expo start` で起動確認している
  - 必要な `docs/` / `.steering/` を更新している

## Definition of Done

- [ ] 受け入れ条件を満たす
- [ ] lint / test / 起動確認が完了している
- [ ] オフライン前提と権限エラー時の挙動が確認されている
- [ ] ドキュメントが同期している
