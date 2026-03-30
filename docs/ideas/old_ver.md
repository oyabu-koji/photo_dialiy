Life Log App — Initial Requirements

1. Overview

本アプリは 写真を中心としたライフログアプリである。
ユーザーは日常の出来事や旅行などを イベント単位で記録できる。

一般的な写真管理アプリと異なり、本アプリは以下を統合して 記憶ログ（Memory Log） を作ることを目的とする。

写真
音声
位置情報
時刻
メモ

最小入力で 思い出を保存できるUX を目指す。

2. Problem

既存の写真アプリには以下の課題がある。

写真だけでは当時の状況や感情が残らない
イベント単位で整理されない
写真とメモや音声が統合されていない
家族の思い出を振り返るログとして使いにくい

その結果

「写真はあるが思い出が残らない」

という状態が生まれている。

3. Value Proposition

本アプリは

写真 + 音声 + 場所

を統合することで

**写真管理ではなく「記憶管理」**を実現する。

特徴

写真中心
イベント単位
音声で簡単記録
オフライン利用可能4. Core Concept
4.1 Photo-Centered Design

本アプリは 写真を中心とした設計とする。

写真を起点として以下の情報を付加する。

音声
位置情報
時刻
テキスト
Entry
├ photos[]
├ voice
├ location
├ created_at
└ text
4.2 Event-Based Logging

1つの記録は イベント単位とする。
例

2026/05/03
名古屋港水族館

photos[]
voice
location
text

1イベントには 複数写真を含めることができる。

5. UX Principles

本アプリのUX設計思想

5.1 Photo First

写真を中心とする。

5.2 Minimal Input

入力は最小限。

写真

- 音声
  5.3 Event Based

出来事単位で記録する。

5.4 Offline First

オフラインでも利用できる。

5.5 Personal Memory

SNSではなく 個人・家族の記憶保存 を目的とする。

6. Primary Use Cases
   6.1 Daily Life Logging
   公園
   家族イベント
   子供の成長
   学校制作物
   6.2 Travel Logging
   旅行
   観光
   レストラン
   自然
   6.3 Memory Preservation

写真だけではなく

音声
場所
メモ

を含めた 思い出記録 を作成する。

7. User Stories
   Story 1

ユーザーは

写真を撮る
↓
音声でコメントを残す
↓
イベントとして保存する

Story 2

旅行後

イベント一覧を見る
↓
写真・音声を再生する
↓
思い出を振り返る

Story 3

子供の成長を

イベント一覧から
時系列で確認する

8. Example Scenario
   動物園に行く

ユーザー

写真を3枚撮る
↓
音声でコメントを残す
↓
保存

保存されるイベント

東山動物園
2026/05/01

photos[3]
voice
location 9. Core Features
9.1 Event Creation

イベント作成フロー

＋ボタン
↓
写真追加
↓
イベント作成
↓
音声録音
↓
保存
9.2 Photo Management

写真は以下の方法で追加できる。

Camera
カメラで撮影
Photo Library
カメラロールから選択

複数選択可能。

9.3 Voice Recording

イベントに音声を追加できる。

用途

コメント
子供の声
思い出説明

音声は後で再生できる。

9.4 Location

位置情報は 自動取得とする。

取得方法

1 GPS
2 写真EXIF

lat
lng
place_name

例

名古屋港水族館
9.5 Text Notes

任意でメモを追加できる。

10. App Structure

アプリは以下の4画面で構成する。

EntryListScreen
EntryDetailScreen
AddEntryScreen
CameraScreen
10.1 EntryListScreen

イベント一覧画面。

表示項目

サムネイル
日付
場所
10.2 EntryDetailScreen

イベント詳細表示。

写真一覧
音声再生
場所
メモ
10.3 AddEntryScreen

イベント作成画面。

写真追加
音声録音
場所表示
メモ入力
保存
10.4 CameraScreen

アプリ内カメラ。

撮影後

AddEntryScreenに戻る11. Data Model
Entry
Entry
├ id
├ created_at
├ lat
├ lng
├ place_name
├ voice_path
└ text
Photos
Photos
├ id
├ entry_id
└ file_path

関係

1 Entry
N Photos 12. Data Lifecycle
写真撮影
↓
Entry作成
↓
SQLite保存
↓
同期キュー
↓
Mac mini同期
↓
サーバーバックアップ13. Storage Architecture
Local Storage

iPhone

SQLite

- ローカルファイル
  app/photos/
  app/voices/
  Server Storage

Mac mini

server/photos/
server/voices/ 14. Sync Architecture

同期は 非同期バックアップ型。

iPhone
↓
ローカル保存
↓
sync_queue
↓
WiFi接続
↓
Mac mini同期
Sync Status
pending
synced 15. Server Architecture

Mac mini 上に API サーバーを構築。

推奨

FastAPI

API

POST /upload/photo
POST /upload/voice
POST /entries

GET /entries
GET /entries/{id} 16. Technology Stack
Mobile
React Native
Expo
expo-image-picker
expo-camera
expo-location
expo-av
expo-file-system
expo-sqlite
Server
FastAPI
Python
SQLite / PostgreSQL 17. Non Goals (MVP)

初期バージョンでは実装しない。

SNS共有
AI日記生成
AIイベント自動生成
クラウドサービス連携18. Future Extensions

将来検討

AI Generated Diary

音声 → 日記生成

AI Event Detection

写真時間・位置からイベント生成

Family Sharing

家族端末共有

Map View

地図から思い出表示

19. Target User

主ユーザー

個人
または
家族

用途

旅行記録
子供の成長ログ
日常記録
