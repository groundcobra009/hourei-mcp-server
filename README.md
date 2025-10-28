# 法令MCP Server

e-Gov法令APIを使用して日本の法令情報を検索・取得するMCPサーバーです。

[![npm version](https://badge.fury.io/js/hourei-mcp-server.svg)](https://www.npmjs.com/package/hourei-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 機能

このMCPサーバーは以下のツールを提供します：

### 1. search_law
法令名や法令番号で法令を検索します。

**パラメータ:**
- `keyword` (必須): 検索キーワード（法令名の一部や法令番号）
- `category` (オプション): 法令の種別
  - `1`: 法律
  - `2`: 政令
  - `3`: 省令
  - `4`: 規則
  - `5`: その他
- `limit` (オプション): 取得する最大件数（デフォルト: 100）

### 2. get_law_data
法令番号を指定して法令の詳細データを取得します。

**パラメータ:**
- `lawNum` (必須): 法令番号（例: 平成十七年法律第百十七号）

### 3. get_law_revision
法令の改正履歴を取得します。

**パラメータ:**
- `lawNum` (必須): 法令番号

## インストール

### npm経由でインストール（推奨）

```bash
npx hourei-mcp-server
```

### ローカル開発

```bash
git clone <repository-url>
cd hourei-mcp-server
npm install
```

## 使用方法

### MCPクライアントでの設定

Claude Desktopなどのクライアントの設定ファイル（`~/Library/Application Support/Claude/claude_desktop_config.json`）に以下を追加：

```json
{
  "mcpServers": {
    "hourei": {
      "command": "npx",
      "args": ["-y", "hourei-mcp-server"]
    }
  }
}
```

設定後、Claude Desktopを再起動してください。

### Cursor AI での設定

Cursorの設定ファイル（`.cursor/mcp_config.json` または設定画面）に以下を追加：

```json
{
  "mcpServers": {
    "hourei": {
      "command": "npx",
      "args": ["-y", "hourei-mcp-server"]
    }
  }
}
```

### ChatGPT Desktop での設定

ChatGPTでは、MCPサーバーのURLを指定する必要があります。

**注意:** ChatGPTでMCPサーバーを使用するには、サーバーをHTTP/SSE経由で公開する必要があります。ローカル実行のみの場合は、以下の方法をご利用ください：

#### 方法1: ローカルでSSEサーバーを立ち上げる（推奨）

1. Express経由でSSEサーバーを起動（別途実装が必要）
2. ChatGPTの設定で以下のように指定：

```json
{
  "mcpServers": {
    "hourei": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

#### 方法2: 他のMCP対応クライアントを使用

ChatGPT以外のクライアント（Claude Desktop、Cursor、Manusなど）では、npx経由で直接実行できます：

```json
{
  "mcpServers": {
    "hourei": {
      "command": "npx",
      "args": ["-y", "hourei-mcp-server"]
    }
  }
}
```

**現在のバージョンはstdio接続のみ対応しています。**  
ChatGPTで使用するには、SSE対応版の実装が必要です。

### Manus での設定

Manusの設定ファイルに以下を追加：

```json
{
  "mcpServers": {
    "hourei": {
      "command": "npx",
      "args": ["-y", "hourei-mcp-server"]
    }
  }
}
```

### Dify での設定

DifyのエージェントでMCPツールを使用する場合：

1. **Difyの設定ファイルに追加**

環境変数またはDifyの設定で以下を指定：

```json
{
  "mcpServers": {
    "hourei": {
      "command": "npx",
      "args": ["-y", "hourei-mcp-server"]
    }
  }
}
```

2. **エージェントブロックでの使用**

Difyのワークフロー内で「ツール」ブロックを追加し、以下のMCPツールを選択：

- `search_law` - 法令検索
- `get_law_data` - 法令詳細取得
- `get_law_revision` - 改正履歴取得

3. **使用例：法令検索エージェント**

```
入力ブロック → LLMブロック → ツールブロック(search_law) → 出力ブロック
```

ツールブロックのパラメータ設定例：
```json
{
  "keyword": "{{user_input}}",
  "category": "1",
  "limit": 100
}
```

### ローカルパスで実行（開発用）

```json
{
  "mcpServers": {
    "hourei": {
      "command": "node",
      "args": ["/path/to/hourei-mcp-server/index.js"]
    }
  }
}
```

## 使用例

このMCPサーバーでできることの具体例です。

### 1. 法令のキーワード検索

**個人情報保護関連の法律を検索:**
```javascript
{
  "keyword": "個人情報保護",
  "category": "1"  // 法律のみ
}
```

**労働基準法を検索:**
```javascript
{
  "keyword": "労働基準法"
}
```

**消費税に関する政令を検索:**
```javascript
{
  "keyword": "消費税",
  "category": "2",  // 政令
  "limit": 50
}
```

### 2. 法令の詳細データ取得

**個人情報保護法の全文を取得:**
```javascript
{
  "lawNum": "平成十五年法律第五十七号"
}
```

**民法の全文を取得:**
```javascript
{
  "lawNum": "明治二十九年法律第八十九号"
}
```

**刑法の全文を取得:**
```javascript
{
  "lawNum": "明治四十年法律第四十五号"
}
```

### 3. 法令の改正履歴を確認

**個人情報保護法の改正履歴:**
```javascript
{
  "lawNum": "平成十五年法律第五十七号"
}
```

## できること

✅ **法令の検索**
- キーワードで法令を検索
- 法律、政令、省令など種別で絞り込み
- 最大100件まで一度に取得可能

✅ **法令データの取得**
- 法令番号を指定して全文取得
- XML形式で構造化されたデータ
- 条文、項、号などの階層構造を含む

✅ **改正履歴の確認**
- いつ、どのように法令が改正されたか
- 改正法令の情報を取得
- 施行日の確認

✅ **活用例**
- 法的調査・リサーチ
- コンプライアンスチェック
- 契約書作成時の参照
- 法令遵守の確認
- 法律相談の補助
- 法改正の追跡
- **Difyエージェントでの法令検索自動化**
- **チャットボットへの法令知識統合**

## 対応クライアント

- ✅ Claude Desktop（npx経由）
- ✅ Cursor AI（npx経由）
- ⚠️ ChatGPT Desktop（URL指定が必要 - SSE対応版が必要）
- ✅ Manus（npx経由）
- ✅ Dify（エージェントワークフロー）
- ✅ その他MCP対応クライアント（stdio接続対応）

## 技術仕様

- Node.js ESM形式
- MCP SDK v0.5.0
- [e-Gov法令API v2](https://laws.e-gov.go.jp/api/2/swagger-ui)を使用
- 対応フォーマット: XML

## 開発

### リポジトリのクローン

```bash
git clone https://github.com/yourusername/hourei-mcp-server.git
cd hourei-mcp-server
npm install
```

### ローカルでテスト

```bash
node index.js
```

## ライセンス

MIT

## 貢献

Pull Requestsを歓迎します！

## サポート

問題が発生した場合は、[Issues](https://github.com/yourusername/hourei-mcp-server/issues)で報告してください。
