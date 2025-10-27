#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// e-Gov法令API基底URL
const EGOV_API_BASE = 'https://laws.e-gov.go.jp/api/1';

class HoureiMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'hourei-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    // ツール一覧の提供
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_law',
          description: '法令名や法令番号で法令を検索します。キーワード検索に対応しています。',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '検索キーワード（法令名の一部や法令番号）',
              },
              category: {
                type: 'string',
                description: '法令の種別（1:法律、2:政令、3:省令など）',
                enum: ['1', '2', '3', '4', '5'],
              },
              limit: {
                type: 'number',
                description: '取得する最大件数（デフォルト: 10）',
                default: 10,
              },
            },
            required: ['keyword'],
          },
        },
        {
          name: 'get_law_data',
          description: '法令番号を指定して法令の詳細データを取得します。',
          inputSchema: {
            type: 'object',
            properties: {
              lawNum: {
                type: 'string',
                description: '法令番号（例: 平成十七年法律第百十七号）',
              },
            },
            required: ['lawNum'],
          },
        },
        {
          name: 'get_law_revision',
          description: '法令の改正履歴を取得します。',
          inputSchema: {
            type: 'object',
            properties: {
              lawNum: {
                type: 'string',
                description: '法令番号（例: 平成十七年法律第百十七号）',
              },
            },
            required: ['lawNum'],
          },
        },
      ],
    }));

    // ツール実行
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'search_law':
            return await this.searchLaw(args);
          case 'get_law_data':
            return await this.getLawData(args);
          case 'get_law_revision':
            return await this.getLawRevision(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `エラーが発生しました: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async searchLaw(args) {
    const { keyword, category, limit = 10 } = args;
    
    // 検索APIのURL構築
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    if (category) {
      params.append('category', category);
    }
    
    const url = `${EGOV_API_BASE}/lawlists/1?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.text();
      
      return {
        content: [
          {
            type: 'text',
            text: `法令検索結果（キーワード: "${keyword}"）:\n\n${data.substring(0, 5000)}${data.length > 5000 ? '\n...(省略)' : ''}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`法令検索に失敗しました: ${error.message}`);
    }
  }

  async getLawData(args) {
    const { lawNum } = args;
    
    const url = `${EGOV_API_BASE}/lawdata/${encodeURIComponent(lawNum)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.text();
      
      return {
        content: [
          {
            type: 'text',
            text: `法令データ（法令番号: ${lawNum}）:\n\n${data.substring(0, 10000)}${data.length > 10000 ? '\n...(省略)' : ''}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`法令データの取得に失敗しました: ${error.message}`);
    }
  }

  async getLawRevision(args) {
    const { lawNum } = args;
    
    const url = `${EGOV_API_BASE}/lawrevisions/${encodeURIComponent(lawNum)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.text();
      
      return {
        content: [
          {
            type: 'text',
            text: `改正履歴（法令番号: ${lawNum}）:\n\n${data}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`改正履歴の取得に失敗しました: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('法令MCP Server running on stdio');
  }
}

const server = new HoureiMCPServer();
server.run().catch(console.error);
