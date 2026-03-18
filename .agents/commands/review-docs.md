---
description: docsディレクトリの永続ドキュメントをレビューする
---

# review-docs

このコマンドは `docs/` にある永続ドキュメントをレビューします。

## 対象ドキュメント

以下の6つのドキュメントをレビューします。

- docs/product-requirements.md
- docs/functional-design.md
- docs/architecture.md
- docs/repository-structure.md
- docs/development-guidelines.md
- docs/glossary.md

## 手順

1. `docs/` ディレクトリを確認する
2. 上記6つのドキュメントが存在するか確認する
3. 各ドキュメントを読み込む
4. `doc-reviewer` サブエージェントにレビューを依頼する
5. レビュー結果をまとめて報告する

## サブエージェント呼び出し

```
subagent:
  agent: doc-reviewer
  input:
    files:
      - docs/product-requirements.md
      - docs/functional-design.md
      - docs/architecture.md
      - docs/repository-structure.md
      - docs/development-guidelines.md
      - docs/glossary.md
```

## 完了条件

- 6つのドキュメントのレビュー結果が提示される
- 改善提案が提示される
