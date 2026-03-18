# Project Context

This repository contains a React Native application built with Expo.

### 日本語説明
このリポジトリは、Expo を使って構築する React Native アプリを前提としています。

## Technology

React Native
Expo managed workflow
JavaScript (not TypeScript)

### 日本語説明
- UI 基盤は React Native です。
- 実行方式は Expo managed workflow を使います。
- 実装言語は JavaScript で、TypeScript は前提にしません。

## Environment

Node 22
Expo SDK 54

### 日本語説明
- Node の実行環境は 22 系を使います。
- Expo SDK は 54 を前提にします。

## Development

Start development server:

`npx expo start`

For remote device testing:

`npx expo start --tunnel`

### 日本語説明
通常の開発サーバー起動は `npx expo start` を使います。  
リモート端末で確認したい場合は `npx expo start --tunnel` を使います。

## Dependency policy

Use `npx expo install` for Expo-related dependencies.

Do not upgrade Expo SDK unless explicitly requested.

Do not change Node version automatically.

### 日本語説明
Expo 関連の依存関係は `npx expo install` を使って追加・更新します。  
Expo SDK は明示依頼がない限りアップグレードしません。  
Node のバージョンも自動では変更しません。
