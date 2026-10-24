#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDeals } from "./deals.js";

const server = new McpServer({ name: "dealscout-mcp", version: "0.1.0" });

server.tool("search_deals", { query: z.string(), maxPrice: z.number().optional(), limit: z.number().int().positive().optional() }, async ({ query, maxPrice, limit }) => ({
  content: [{ type: "text", text: JSON.stringify(await searchDeals(query, undefined, { maxPrice, limit })) }],
}));

await server.connect(new StdioServerTransport());

