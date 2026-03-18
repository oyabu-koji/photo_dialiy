# 実装ガイド

## 基本方針

- 新規コードは JavaScript で実装する
- 画面は React Native + Expo を前提に設計する
- データ契約は JSDoc とテストで明文化する
- 端末依存処理は `services/` に閉じ込める

## 推奨確認コマンド

```bash
npm run lint
npm test
npx expo start
```

## JSDoc 規約

### データ構造

```javascript
/**
 * @typedef {Object} GameSessionState
 * @property {CardModel[]} cards
 * @property {string[]} selectedCardIds
 * @property {number} matchedPairs
 * @property {'idle' | 'playing' | 'resolving' | 'finished'} gameStatus
 */
```

### 関数契約

```javascript
/**
 * @param {GameSessionState} state
 * @param {string} cardId
 * @returns {GameSessionState}
 */
function revealCard(state, cardId) {
  return state;
}
```

JSDoc では次を明示します。

- 入力の意味
- 出力の意味
- 制約や副作用
- 文字列ユニオン相当の状態値

## 命名規則

```javascript
const selectedCardIds = [];
const isMatched = false;

function createDeck() {
  return [];
}

function useGameSession() {
  return {};
}

function MemoryCard() {
  return <View />;
}
```

- 変数 / 関数: `camelCase`
- コンポーネント: `PascalCase`
- hook: `use` で始める
- 真偽値: `is` / `has` / `can` / `should`

## ファイル規約

- 画面: `PascalCaseScreen.jsx`
- コンポーネント: `PascalCase.jsx`
- hook / service / util: `camelCase.js`
- JSDoc 定義補助: `*.types.js`
- test: `*.test.js` / `*.test.jsx`

## コンポーネント設計

### 画面

- 画面は表示とイベント受付に集中する
- Expo API を直接呼ばない
- 画面内で複雑な状態遷移を持たない

### hook

- 状態遷移の一次ソースにする
- 画面イベントと純粋ロジックを接続する
- 非同期演出の順序を制御する

### logic

- React や Expo へ依存しない
- 純粋関数中心に保つ
- unit test を最優先で書く

### services

- 音、振動、将来の保存などを担当する
- 利用不可でも UI を壊さない
- 失敗してもゲーム進行を止めない

## エラーハンドリング

```javascript
class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

try {
  await feedbackService.play('match');
} catch (error) {
  logger.warn('feedback unavailable', error);
}
```

- 入力不正は `ValidationError` のような明示的なエラーにする
- Expo API の失敗は recoverable error として扱う
- `catch` で握りつぶす場合は、なぜ続行できるかを説明する

## コメント規約

- コメントは「なぜそうするか」を補う時だけ書く
- 子供向け UX の配慮、端末差異回避、状態競合回避の理由は残す
- コードを見れば分かる説明は書かない

## セキュリティ / 品質

- 個人情報を扱わない前提でも入力検証は行う
- 不要な権限を要求しない
- エラー表示に機密情報を含めない

## パフォーマンス

- 長い計算は `logic/` に隔離する
- 画面ごとの再描画を意識し、不要な状態を増やしすぎない
- アセットを大きくしすぎない

## テスト実装

### unit test

```javascript
import { describe, expect, it } from 'vitest';
import { createDeck } from '../logic/createDeck';

describe('createDeck', () => {
  it('creates paired cards', () => {
    const deck = createDeck({ rows: 5, columns: 4, pairCount: 10 });
    expect(deck).toHaveLength(20);
  });
});
```

### component test

```javascript
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../shared/test-support/renderWithProviders';
import { HomeScreen } from '../screens/HomeScreen';

it('starts game from home screen', () => {
  const onStart = vi.fn();
  renderWithProviders(<HomeScreen onStart={onStart} />);
  fireEvent.press(screen.getByText('あそぶ'));
  expect(onStart).toHaveBeenCalled();
});
```

### 起動確認

- `npx expo start` でアプリが立ち上がることを確認する
- 主要フローはシミュレータまたは実機で一度触る
- 音、振動、オフライン挙動の変更は `.steering` に記録する

## 完成チェック

- [ ] JSDoc で主要なデータ契約が読める
- [ ] 画面 / hook / logic / services の責務が混ざっていない
- [ ] `npm run lint` と `npm test` が前提になっている
- [ ] `npx expo start` を使う起動確認が入っている
