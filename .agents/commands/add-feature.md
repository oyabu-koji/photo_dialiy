---
description: Deprecated. Use plan-feature -> implement-feature -> implementation-validator.
---

# add-feature (Deprecated)

このコマンドは新規テンプレートでは正式フローとして使用しません。  
後方互換のために残していますが、以下の順序を使ってください。

1. `plan-feature <feature-name>`
2. `implement-feature <feature-name>`
3. `implementation-validator`

## 理由

- 設計と実装と検証を明確に分離するため
- `.steering/[YYYYMMDD]-[task]/` の更新責務を分かりやすくするため
- AI エージェントの役割を一貫させるため

## 置き換え手順

- 新機能の要求・設計を作る: `plan-feature`
- tasklist に従って実装する: `implement-feature`
- 実装を厳しめに検証する: `implementation-validator`

## 注意

- 新しいプロジェクトでは `add-feature` を主要ワークフローとして案内しない
- `AGENTS.md` と `README.md` の公式フローを優先する
