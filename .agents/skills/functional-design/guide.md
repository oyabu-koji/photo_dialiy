# 機能設計書ガイド

## 目的

`docs/functional-design.md` は、PRD で定義した要求を画面、状態、ロジック、フィードバックへ分解するドキュメントです。  
実装者が「何をどこまで作るか」を迷わない粒度まで落としてください。

## このプロジェクトで固定する前提

- React Native + Expo + JavaScript を前提にする
- 主要画面、hook、service、純粋ロジックの責務を分ける
- データ契約は JSDoc と文章で表現する
- 品質確認の基本は `npm run lint`、`npm test`、`npx expo start`

## まず整理すること

### 1. 対象範囲

- MVP に含める画面
- 実装しないもの
- 将来拡張として残すもの

### 2. 主要フロー

- 起動
- ゲーム開始
- カード選択
- 成功 / 失敗フィードバック
- クリア
- リスタート

### 3. 状態

最低でも次を明確にします。

- カード一覧
- 選択中カード
- マッチ済み数
- 進行状態
- 一時的な入力ロック状態

## データモデルの書き方

JavaScript 前提なので、構造は JSDoc で残します。

```javascript
/**
 * @typedef {Object} CardModel
 * @property {string} id
 * @property {string} symbol
 * @property {boolean} isFlipped
 * @property {boolean} isMatched
 * @property {number} position
 */
```

必要に応じて次も書きます。

- 制約
- 初期値
- 許容範囲
- 状態遷移条件

## コンポーネント設計の書き方

最低でも次を分けて書きます。

- `HomeScreen`
- `GameScreen`
- 主要 UI コンポーネント
- `useGameSession` のような hook
- `feedbackService` のような Expo 依存サービス

各項目では以下を記載します。

- 責務
- 依存先
- 外部から見える props / return 値
- 禁止事項

### props / return の表現例

```javascript
/**
 * @typedef {Object} GameBoardProps
 * @property {CardModel[]} cards
 * @property {boolean} disabled
 * @property {(cardId: string) => void} onCardPress
 */
```

## ユースケースと状態遷移

主要フローは sequence diagram か numbered steps で残します。  
状態遷移では、入力を受け付けない条件を必ず明記してください。

例:

- `selectedCardIds` が 2 件の間は追加タップを無視する
- `finished` になったら盤面入力を止める

## テスト戦略に入れる内容

- unit test 対象: 純粋ロジック
- component test 対象: 主要画面フロー
- 起動確認: Expo 起動と主要シナリオ

コマンド例:

```bash
npm run lint
npm test
npx expo start
```

## よくある不足

- props だけ書いて責務がない
- 状態名はあるが遷移条件がない
- 成功時だけで失敗時の UI がない
- 画面フローはあるがテスト観点がない

## 推奨の章立て

1. 対象範囲
2. システム構成図
3. 技術スタック
4. データモデル定義
5. コンポーネント設計
6. ユースケース図
7. 状態遷移
8. エラーハンドリング
9. テスト戦略

## 完成チェック

- [ ] JavaScript / JSDoc 前提でデータ契約が書かれている
- [ ] 主要画面、hook、service、logic の責務が分かれている
- [ ] 無効入力や入力ロックの扱いが明記されている
- [ ] `npm run lint` / `npm test` / `npx expo start` を使う確認観点がある
