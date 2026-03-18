---
name: steering
description: 作業単位の計画書（requirements/design/tasklist）を作成し、実装進捗を維持するスキル
---

# Steering Skill

## 目的

- `.steering/` で作業計画を明文化する
- `tasklist.md` と実装を同期させる
- 実装後に振り返りを残す

## モード1: 計画作成

1. `docs/` の永続ドキュメント6点が揃っているか確認する
2. 不足している場合は `docs/ideas/initial-requirements.md` を起点に `setup-project` 相当の流れで先に `docs/` を初期化する
3. `.steering/[YYYYMMDD]-[task]/` を作成
4. 以下を読んで方針を確定
   - `docs/product-requirements.md`
   - `docs/functional-design.md`
   - `docs/architecture.md`
   - `docs/repository-structure.md`
   - `docs/development-guidelines.md`
5. テンプレートから生成
   - `.agents/skills/steering/templates/requirements.md`
   - `.agents/skills/steering/templates/design.md`
   - `.agents/skills/steering/templates/tasklist.md`
6. `tasklist.md` を具体タスクに分解

## モード2: 実装

1. 対象 `.steering/[YYYYMMDD]-[task]/` の `requirements.md` / `design.md` / `tasklist.md` を先に読む
2. `tasklist.md` の未完了タスクを1件選ぶ
3. 実装する
4. 完了したら `tasklist.md` を更新する
5. 要件や設計の判断が変わった場合は `requirements.md` / `design.md` も更新する
6. 全タスク完了まで繰り返す

### 重要ルール

- 実装・レビュー・調査の開始前に対象 `.steering/...` を必ず参照する
- `tasklist.md` を更新せずに次へ進まない
- タスク完了ごとに、関連する構造化メモの更新要否を確認する
- タスクが大きすぎる場合は分割する
- 技術的理由がある場合のみ、理由付きでスキップ記録を許可

## モード3: 振り返り

1. 全タスク完了を確認
2. `tasklist.md` の振り返り欄に記録
   - 実装完了日
   - 計画との差分
   - 学び
   - 次回改善

## 使い方の目安

- 仕様が曖昧なら `requirements.md` を先に厚くする
- 変更が大きい場合は `design.md` も更新する
- 長時間作業は背景実行を使って並列化する
