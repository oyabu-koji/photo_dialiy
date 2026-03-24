---
description: 新機能の設計のみを作成する（実装は行わない）
---

# plan-feature

引数: 機能名（例: `plan-feature feature-name`）

このコマンドは新機能の**設計のみ**を作成します。
コードの実装は行いません。

## 目的

新機能の要求・設計・実装タスクを整理し、実装前に合意できる状態を作る。

---

# 手順

## 1. コンテキスト準備

- `docs/` の永続ドキュメントを読み込む
- プロジェクトの前提技術を理解する
- `docs/` に記載された方針・制約・設計原則を優先する
- 新機能設計は既存 docs と矛盾しないこと
- 矛盾や未確定事項がある場合は「要確認事項」として明記する

このプロジェクトの技術スタック

- React Native
- Expo
- JavaScript

---

## 2. 機能の理解

以下を整理する

- 機能の目的
- ユーザー操作
- UI構成
- データ構造
- 状態管理
- navigationへの影響
- 既存機能への影響
- 今回やらないこと

---

## 3. steeringディレクトリ作成

以下のディレクトリを作成する

.steering/[YYYYMMDD]-[feature-name]/

その中に次のファイルを作成する

.steering/[YYYYMMDD]-[feature-name]/requirements.md
.steering/[YYYYMMDD]-[feature-name]/design.md
.steering/[YYYYMMDD]-[feature-name]/tasklist.md

---

## 4. requirements.md

記載内容

- 機能の目的
- ユースケース
- ユーザーフロー
- 非機能要件
- 今回やらないこと
- 要確認事項

---

## 5. design.md

以下を整理する

- 画面構成
- コンポーネント設計
- state設計
- hooks設計
- データモデル
- 既存画面・既存機能への影響
- エラーパターン
- ディレクトリ/ファイル追加予定
- 要確認事項

React Native / Expo のベストプラクティスを考慮する。

曖昧な表現は避け、責務分担を具体的に記載すること。

---

## 6. tasklist.md

実装タスクを小さく分解する。

例

- navigation 追加
- screen 作成
- component 作成
- state 管理
- API / storage 接続
- テスト

タスクは **小さく具体的に**分割し、**実装順に並べる**こと。

---

# 重要ルール

このコマンドでは **コードを実装してはいけない**。
既存コードを編集しない。
実装例コードを書かない。

作成するのは以下の3ファイルのみ

- requirements.md
- design.md
- tasklist.md

---

# 完了条件

- steeringディレクトリが作成されている
- requirements.md が作成されている
- design.md が作成されている
- tasklist.md が作成されている

このコマンドは **設計完了で終了する**。
