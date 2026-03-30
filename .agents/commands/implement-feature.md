---
description: steering の tasklist に従って機能を実装する
---

# implement-feature

引数: 機能名（例: `implement-feature feature-name`）

このコマンドは `.steering` に作成された設計を元に
機能を実装します。

---

# 手順

## 1. steeringディレクトリ確認

以下のディレクトリを探す

.steering/[YYYYMMDD]-[feature-name]/

その中のファイルを読み込む

.steering/[YYYYMMDD]-[feature-name]/requirements.md
.steering/[YYYYMMDD]-[feature-name]/design.md
.steering/[YYYYMMDD]-[feature-name]/tasklist.md

---

## 2. 設計理解

以下を理解する

- 機能の目的
- UI構造
- コンポーネント設計
- 状態管理
- データ構造

このプロジェクトは以下の技術スタックを使用する

- React Native
- Expo
- JavaScript

---

## 2.5 durable docs 影響確認

実装開始前に、今回の変更が以下の durable docs に影響するか確認する

- `docs/product-requirements.md`
- `docs/functional-design.md`
- `docs/architecture.md`
- `docs/repository-structure.md`
- `docs/development-guidelines.md`
- `docs/glossary.md`

安定した仕様・設計・用語の変更がある場合は、
実装と同じ作業単位で更新する。

---

## 3. 実装

tasklist.md に書かれているタスクを
**1つずつ実装する**

重要ルール

- 一度に複数タスクを実装してはいけない
- 1タスク実装したら tasklist.md を更新する
- 必要なら design.md を更新する
- 安定した仕様・設計・用語変更が発生した場合、影響する `docs/` を更新する
- `docs/` 更新が必要な場合、未更新のままタスク完了にしてはいけない
- 実装と `.steering` と durable docs が矛盾した場合、先にドキュメントを同期する

---

## 4. 品質確認

実装後に以下を確認する

- `tasklist.md` が最新化されている
- 影響する durable docs が更新されている
- 実装と `docs/` / `.steering/` に不整合がない

以下を実行する

- `npm run lint`
- `npm test`
- 必要に応じて `npx expo start`

---

## 5. 検証

implementation-validator サブエージェントを呼び出す

implementation-validator には、今回変更した実装ファイル・関連設定ファイル・durable docs・steering を渡す。
`src` に固定せず、変更対象に応じて指定する。

例:

```
subagent:
  agent: implementation-validator
  input:
    paths:
      - App.jsx
      - index.js
      - app.json
      - src
      - docs
      - .steering/[YYYYMMDD]-[feature-name]
```

---

# 完了条件

- tasklist.md のタスクが完了している
- 影響する durable docs が更新されている
- lint エラーがない
- validator による検証が完了している
