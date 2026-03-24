# Life Log App - Initial Requirements (v2)

## 1. Overview

本アプリは写真を中心としたライフログアプリである。

ユーザーは日常の出来事や旅行などをイベント単位で記録できる。

本アプリは以下の情報を統合して、記憶ログ（Memory Log）を作ることを目的とする。

- 写真
- 音声
- 位置情報
- 時刻

最小入力で思い出を残せる UX を目指す。

基本入力は以下とする。

- 写真
- 音声

## 2. Problem

既存の写真アプリには以下の課題がある。

- 写真だけでは当時の状況や感情が残らない
- イベント単位で整理されない
- 写真と音声が統合されていない
- 家族の思い出ログとして使いにくい

その結果、

「写真はあるが思い出が残らない」

という状態が生まれている。

## 3. Value Proposition

本アプリは

- 写真
- 音声
- 場所

を統合することで、

写真管理ではなく「記憶管理」を実現する。

特徴:

- 写真中心
- イベント単位
- 音声で簡単記録
- オフライン利用可能

## 4. Core Concept

### 4.1 Photo-Centered Design

写真を起点として思い出を記録する。

```text
Entry
├ photos[]
├ voice
├ location
└ created_at
```

### 4.2 Event-Based Logging

記録はイベント単位とする。

例:

```text
2026/05/03
名古屋港水族館

photos[]
voice
location
```

1イベントには複数写真を含めることができる。

## 5. UX Principles

### 5.1 Photo First

写真中心で記録する。

### 5.2 Minimal Input

入力は最小限とする。

- 写真
- 音声

### 5.3 Event Based

出来事単位で記録する。

### 5.4 Offline First

オフライン利用を前提とする。

### 5.5 Personal Memory

SNS ではなく、家族の思い出保存を目的とする。

## 6. Primary Use Cases

### 6.1 Daily Life Logging

- 公園
- 家族イベント
- 子供の成長
- 学校制作物

### 6.2 Travel Logging

- 旅行
- 観光
- レストラン
- 自然

### 6.3 Memory Preservation

写真だけではなく、音声と場所を含めた思い出記録を作成する。

## 7. User Stories

### Story 1

ユーザーは

```text
写真を撮る
↓
音声でコメントを残す
↓
イベントとして保存する
```

### Story 2

旅行後に

```text
イベント一覧を見る
↓
写真と音声を再生する
↓
思い出を振り返る
```

### Story 3

子供の成長をイベント一覧から時系列で確認する。

## 8. Example Scenario

### 動物園に行く

ユーザーは

```text
写真を3枚撮る
↓
音声でコメントを残す
↓
保存
```

保存されるイベント:

```text
東山動物園
2026/05/01

photos[3]
voice
location
```

## 9. Core Features

### 9.1 Event Creation

イベント作成フロー:

```text
+ ボタン
↓
Photo Picker
↓
Create Entry
↓
AddEntryScreen
↓
音声録音
↓
保存
```

### 9.2 Photo Management

写真取得方法:

- Camera
- Photo Library

複数選択可能。

Photo Storage Strategy:

- 写真は Camera Roll の URI を参照する
- アプリ内へのコピーは行わない
- `local_uri` には Camera Roll のパスを保存する
- 写真の二重保存は行わない

### 9.3 Voice Recording

イベントには音声1つを保存できる。

用途:

- 思い出コメント
- 子供の声
- 旅行メモ

録音した音声は後で再生できる。

### 9.4 Location

位置情報は自動取得する。

位置取得優先順位:

1. Photo EXIF
2. GPS（AddEntry 時）
3. 位置なし

保持情報:

- lat
- lng
- place_name

例:

```text
名古屋港水族館
```

## 10. App Structure

アプリは以下の4画面で構成する。

- EntryListScreen
- MapScreen
- AddEntryScreen
- EntryDetailScreen

### 10.1 EntryListScreen

イベントタイムラインを表示する。

表示項目:

- サムネイル
- タイトル
- 日付

サムネイルには `photos[0]` を使用する。

### 10.2 MapScreen

思い出を地図上に表示する。

- 1イベント = 1ピン
- ピンには写真サムネイルを表示する

ピン操作:

```text
Pin
↓
Preview
↓
EntryDetail
```

イベント位置は写真 EXIF から生成する。

```text
event_lat = avg(photo_lat)
event_lng = avg(photo_lng)
```

位置取得優先順位:

1. Photo EXIF
2. GPS（AddEntry 時）
3. 位置なし

Map を開いたときは、全イベントが見える範囲で表示する。

### 10.3 AddEntryScreen

イベント作成・編集画面。

表示内容:

- 写真一覧
- 音声録音
- 場所表示
- 保存

### 10.4 EntryDetailScreen

イベント詳細表示画面。

表示内容:

- 写真一覧
- 音声再生
- 場所
- 日付

## 11. Navigation Structure

Timeline（EntryList）と Map の2タブ構成とする。

基本遷移:

```text
EntryList -> EntryDetail
Map -> EntryDetail
EntryDetail -> 編集 -> AddEntry
```

新規作成:

```text
+ ボタン
↓
Photo Picker
↓
Create Entry
↓
AddEntry
```

## 12. Data Model

### Entry

```text
Entry
├ id (UUID)
├ title
├ created_at
├ lat
├ lng
├ place_name
├ voice_path
└ sync_status
```

タイトル生成ルール:

```text
place_name + date
```

### Photo

```text
Photo
├ id (UUID)
├ entry_id
├ local_uri
├ server_path
├ lat
├ lng
└ created_at
```

関係:

```text
1 Entry
N Photos
```

- `local_uri` は Camera Roll の URI を保持する
- 写真はアプリ内へコピーしない

## 13. Data Lifecycle

```text
写真撮影
↓
Entry作成
↓
SQLite保存
↓
sync_queue
├ photo upload
├ voice upload
└ entry metadata
↓
Mac mini同期
↓
サーバーバックアップ
```

## 14. Storage Architecture

### Local

iPhone:

- SQLite
- Camera Roll references (`local_uri`)
- app/voices/

### Server

Mac mini:

- server/photos/
- server/voices/

## 15. Sync Architecture

同期は非同期バックアップ型とする。

同期フロー:

```text
iPhone
↓
ローカル保存
↓
sync_queue
├ photo upload
├ voice upload
└ entry metadata
↓
WiFi接続
↓
Mac mini同期
```

同期タイミング:

- WiFi接続時
- アプリ起動時

同期状態:

- pending
- synced

## 16. Server Architecture

Mac mini 上で API サーバーを動作させる。

推奨:

- FastAPI

API:

- POST /upload/photo
- POST /upload/voice
- POST /entries
- GET /entries
- GET /entries/{id}

## 17. Technology Stack

### Mobile

- React Native
- Expo
- react-native-maps
- expo-image-picker
- expo-camera
- expo-location
- expo-av
- expo-file-system
- expo-sqlite

### Server

- FastAPI
- Python
- SQLite / PostgreSQL

## 18. Non Goals (MVP)

初期バージョンでは実装しない。

- SNS共有
- AI日記生成
- AIイベント自動生成
- クラウドサービス

## 19. Future Extensions

- AI Diary Generation
  - 音声 -> 日記生成
- AI Event Detection
  - 写真時間・位置からイベント生成
- AI Photo Selection
- Family Sharing
  - 家族端末共有
- Map View
  - 地図から思い出表示

## 20. Target User

主ユーザー:

- 個人
- 家族

用途:

- 旅行ログ
- 子供成長ログ
- 日常ログ
