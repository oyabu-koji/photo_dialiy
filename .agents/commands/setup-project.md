---
description: 初回セットアップ。6つの永続ドキュメントを対話的に作成する
---

# setup-project

このワークフローは `docs/` の永続ドキュメントを初期作成します。

## 実行イメージ

- チャットで「setup-projectを実行して」と依頼
- 必要なら `$prd-writing` などを明示指定

## 手順

1. `docs/ideas/` のマークダウンを読み、初期要件を整理する
2. 特に `docs/ideas/initial-requirements.md` を起点にする
3. 利用可能ならドキュメント作成やレビューを背景実行へ委任する
4. `docs/product-requirements.md` を作成し、承認を得る
5. 以降を順に作成する
   - `docs/functional-design.md`
   - `docs/architecture.md`
   - `docs/repository-structure.md`
   - `docs/development-guidelines.md`
   - `docs/glossary.md`
6. 作成したドキュメントの整合性を確認する

## 必須ルール

- `docs/` が空、または6つの永続ドキュメントが不足している場合は、このワークフローを優先する
- 実装や `.steering/` 作成を先に進めてはならない
- 作成完了条件は6ファイルがすべて存在すること

## 完了条件

- 上記6ファイルが作成済みであること
- 次に実装へ進むための論点が明確であること
