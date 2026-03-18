# Project Template

This directory is a reusable base template for new AI-driven React Native projects.

### 日本語説明
このディレクトリは、AI 駆動で開発する React Native プロジェクト向けの再利用テンプレートです。

## Template assumptions

- React Native
- Expo managed workflow
- JavaScript
- Node 22
- Expo SDK 54

### 日本語説明
- React Native を使う前提です。
- Expo managed workflow を採用します。
- 実装言語は JavaScript です。
- Node 22 と Expo SDK 54 を前提にします。

## Included files

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `docs/ideas/initial-requirements.md`
- `.steering/.gitkeep`
- `.agents/`
- `.gitignore`
- `.nvmrc`
- `.devcontainer/` (optional)

`.agents/` contains reusable commands, skills, settings, and review agents copied from the current project where they are generic enough for new React Native + Expo + JavaScript projects.

The template intentionally does not include application source code, `node_modules`, or `package-lock.json`.

### 日本語説明
- `AGENTS.md` は AI エージェント向けの運用ルールです。
- `PROJECT_CONTEXT.md` は技術前提と環境制約をまとめた文書です。
- `docs/ideas/initial-requirements.md` は最初の要求整理に使います。
- `.steering/.gitkeep` はタスク単位の計画ディレクトリを保持するためのプレースホルダーです。
- `.agents/` には再利用可能な commands、skills、settings、review agents が入っています。
- `.gitignore` と `.nvmrc` は共通開発環境の前提を揃えるために含めています。
- `.devcontainer/` は将来利用できる任意の開発環境設定です。

このテンプレートにはアプリケーションのソースコード、`node_modules`、`package-lock.json` は含まれていません。

## How to start a new project from this template

1. Create a new repository for the project.
2. Copy the contents of `project-template/` into the new repository root.
3. Read `AGENTS.md`, `PROJECT_CONTEXT.md`, and `.agents/README.md`.
4. Run `init-project` to create the Expo managed workflow baseline.
5. Keep the environment pinned to Node 22 and Expo SDK 54.
6. Write the project idea in `docs/ideas/initial-requirements.md`.
7. Run `setup-project` to create the six durable docs.
8. Create `.steering/[YYYYMMDD]-[task]/` for the first task.
9. Use the workflow `plan-feature` -> `implement-feature` -> `implementation-validator`.

### 日本語説明
1. 新しいプロジェクト用のリポジトリを作成します。
2. `project-template/` の中身を新しいリポジトリのルートへコピーします。
3. `AGENTS.md`、`PROJECT_CONTEXT.md`、`.agents/README.md` を読みます。
4. `init-project` を実行して Expo managed workflow の土台を作成します。
5. 開発環境は Node 22 と Expo SDK 54 に固定します。
6. `docs/ideas/initial-requirements.md` にプロジェクトのアイデアを書きます。
7. `setup-project` を実行して 6 つの永続ドキュメントを作成します。
8. 最初の作業用に `.steering/[YYYYMMDD]-[task]/` を作成します。
9. `plan-feature` -> `implement-feature` -> `implementation-validator` の順で進めます。

## Development commands

- `npx expo start`
- `npx expo start --tunnel`

### 日本語説明
- `npx expo start` は通常の開発サーバー起動に使います。
- `npx expo start --tunnel` はリモート端末から接続したい場合に使います。

## Workflow note

Run `init-project` before `setup-project`.

`init-project` prepares the Expo app baseline and shared environment files.

`setup-project` prepares the six durable documents from `docs/ideas/initial-requirements.md`.

`.devcontainer/` is kept in the template as an optional future-ready setup. It does not mean Docker must be used immediately.

### 日本語説明
`init-project` は `setup-project` より先に実行します。  
`init-project` は Expo アプリの土台と共通環境ファイルを整えます。  
`setup-project` は `docs/ideas/initial-requirements.md` をもとに 6 つの永続ドキュメントを作ります。  
`.devcontainer/` は将来用にテンプレートへ残しますが、現時点で Docker 利用は必須ではありません。

## Dependency policy

- Use `npx expo install` for Expo-related dependencies
- Do not upgrade Expo SDK automatically
- Do not change Node version automatically

### 日本語説明
- Expo 関連の依存追加や更新では `npx expo install` を使います。
- Expo SDK は明示依頼がない限り自動アップグレードしません。
- Node のバージョンも自動では変更しません。
