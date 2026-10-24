#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseArgs } from "node:util";
import { z } from "zod";
import { searchDeals } from "./deals.js";

if (process.argv[2] === "search") {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(3),
    allowPositionals: true,
    options: { "max-price": { type: "string" }, limit: { type: "string" } },
  });
  const num = (s?: string) => (s === undefined ? undefined : Number(s));
  console.log(JSON.stringify(await searchDeals(positionals.join(" "), undefined, { maxPrice: num(values["max-price"]), limit: num(values.limit) }), null, 2));
  process.exit(0);
}

const server = new McpServer({ name: "dealscout-mcp", version: "0.1.0" });

server.tool("search_deals", { query: z.string(), maxPrice: z.number().optional(), limit: z.number().int().positive().optional() }, async ({ query, maxPrice, limit }) => ({
  content: [{ type: "text", text: JSON.stringify(await searchDeals(query, undefined, { maxPrice, limit })) }],
}));

await server.connect(new StdioServerTransport());

