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

ChatGPTの設定ファイルに以下を追加：

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

### 法令検索
```javascript
// "個人情報保護"をキーワードに法律を検索
{
  "keyword": "個人情報保護",
  "category": "1"
}
```

### 法令データ取得
```javascript
// 個人情報保護法の詳細を取得
{
  "lawNum": "平成十五年法律第五十七号"
}
```

## 対応クライアント

- ✅ Claude Desktop
- ✅ Cursor AI
- ✅ ChatGPT Desktop
- ✅ Manus
- ✅ その他MCP対応クライアント

## 技術仕様

- Node.js ESM形式
- MCP SDK v0.5.0
- e-Gov法令API v1を使用

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
