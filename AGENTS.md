# Codex Project Memory

### 日本語説明
このファイルは、AI エージェントが新規プロジェクトで一貫した進め方を取るための運用メモです。

## Technology Stack

- App type: React Native mobile application
- Framework: Expo managed workflow
- Language: JavaScript
- Package manager: npm
- Environment: Node 22, Expo SDK 54
- Start command: `npx expo start`
- Remote device testing: `npx expo start --tunnel`

### 日本語説明
- アプリ種別は React Native のモバイルアプリです。
- 実行基盤は Expo managed workflow を前提にします。
- 実装言語は JavaScript を使います。
- パッケージ管理は npm を想定しています。
- 開発環境は Node 22 と Expo SDK 54 に固定します。
- 通常の起動は `npx expo start`、リモート端末確認は `npx expo start --tunnel` を使います。

## Purpose

This template is the starting point for an AI-driven React Native + Expo + JavaScript project.

### 日本語説明
このテンプレートは、AI 駆動で React Native + Expo + JavaScript の新規プロジェクトを始めるための出発点です。

## Core Workflow

1. Read `PROJECT_CONTEXT.md`
2. Run `init-project` to create the Expo managed workflow baseline
3. Fill in `docs/ideas/initial-requirements.md`
4. Run `setup-project` to create the six durable docs
5. Create `.steering/[YYYYMMDD]-[task]/`
6. Use `plan-feature` to define requirements, design, and task breakdown
7. Use `implement-feature` to make changes and update `.steering/.../tasklist.md`
8. Use `implementation-validator` to review the implementation strictly
9. Start the app with `npx expo start`
10. Use `npx expo start --tunnel` when remote device testing is needed

### 日本語説明
基本フローは、まず `PROJECT_CONTEXT.md` と初期要件を読み、`.steering/[YYYYMMDD]-[task]/` を作ってから進める形です。  
最初に `init-project` で Expo managed workflow の土台を整え、その後 `setup-project` で永続ドキュメントを作成します。  
設計は `plan-feature`、実装は `implement-feature`、厳しめの検証は `implementation-validator` を使います。  
起動確認は `npx expo start`、リモート端末確認は `npx expo start --tunnel` を使います。

## Working Rules

- Use React Native + Expo managed workflow + JavaScript as the default project assumption
- Do not introduce TypeScript unless explicitly requested
- Do not upgrade Expo SDK automatically
- Do not change the Node version automatically
- Use `npx expo install` for Expo-related dependencies
- Reuse the commands, skills, and review agents provided under `.agents/`
- Keep short-term task planning in `.steering/`
- Keep durable product and engineering documentation in `docs/`
- Update `docs/` when stable requirements or architecture decisions change
- Keep `.devcontainer/` in the repository as an optional future-facing setup, even if Docker is not used now

### 日本語説明
- デフォルト前提は React Native + Expo managed workflow + JavaScript です。
- 明示依頼がない限り TypeScript は導入しません。
- Expo SDK や Node のバージョンは自動で変更しません。
- Expo 関連の依存追加や更新では `npx expo install` を使います。
- `.agents/` 配下の command、skill、review agent を再利用します。
- 短期タスク管理は `.steering/`、長期的に残す設計文書は `docs/` に置きます。
- 安定した要件や設計判断が変わったら `docs/` を更新します。

## Troubleshooting

- If `npx expo start --tunnel` repeatedly prompts to install `@expo/ngrok` even after global installation, start Expo with `NODE_PATH="$(npm root -g)" npx expo start --tunnel`. Add `--clear` when retrying after cache or tunnel startup issues.
- This workaround is for Homebrew Node global module resolution on this machine

### 日本語説明
- `npx expo start --tunnel` 実行時に `@expo/ngrok` のグローバルインストール確認が繰り返される場合は、`NODE_PATH="$(npm root -g)" npx expo start --tunnel` を使います。キャッシュや tunnel 起動失敗の再試行時は `--clear` を追加します。
- これはこのマシンの Homebrew Node におけるグローバルモジュール解決を補う回避策です。

## Expected Directories

### 日本語説明
新規プロジェクトでは、以下のディレクトリやファイル群を標準構成として想定します。

### Initial input

- `docs/ideas/initial-requirements.md`

#### 日本語説明
初期要件の整理を始める起点となるファイルです。

### Durable docs

- `docs/product-requirements.md`
- `docs/functional-design.md`
- `docs/architecture.md`
- `docs/repository-structure.md`
- `docs/development-guidelines.md`
- `docs/glossary.md`

#### 日本語説明
ここにある 6 つの文書は、要件・設計・構成・用語を長期的に管理するための恒久ドキュメントです。

### Task-level planning

- `.steering/[YYYYMMDD]-[task]/requirements.md`
- `.steering/[YYYYMMDD]-[task]/design.md`
- `.steering/[YYYYMMDD]-[task]/tasklist.md`

#### 日本語説明
各タスクごとに `.steering/[YYYYMMDD]-[task]/` を作り、要求整理、設計、進捗管理を分けて記録します。

## Template Notes

- This template intentionally does not include application source code
- This template intentionally does not include `node_modules`
- This template intentionally does not include `package-lock.json`
- This template includes reusable AI workflow configuration under `.agents/`

### 日本語説明
- このテンプレートにはアプリ本体のソースコードを含めません。
- `node_modules` は含めません。
- `package-lock.json` も含めません。
- 代わりに `.agents/` 配下へ再利用可能な AI ワークフロー設定を含めています。
