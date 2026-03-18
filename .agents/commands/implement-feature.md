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

## 3. 実装

tasklist.md に書かれているタスクを
**1つずつ実装する**

重要ルール

- 一度に複数タスクを実装してはいけない
- 1タスク実装したら tasklist.md を更新する
- 必要なら design.md を更新する

---

## 4. 品質確認

実装後に以下を実行する

npm run lint

必要に応じて

npx expo start

---

## 5. 検証

implementation-validator サブエージェントを呼び出す

```
subagent:
  agent: implementation-validator
  input:
    paths:
      - src
```

---

# 完了条件

- tasklist.md のタスクが完了している
- lint エラーがない
- validator による検証が完了している
