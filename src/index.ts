#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseArgs } from "node:util";
import { z } from "zod";
import { searchDeals } from "./deals.js";

const USAGE = "Usage: dealscout-mcp [search <query> [--max-price N] [--limit N]]\n  no args: run MCP stdio server";
const fail = (msg: string): never => {
  console.error(`${msg}\n${USAGE}`);
  process.exit(2);
};

if (["-h", "--help", "help"].includes(process.argv[2] ?? "")) {
  console.log(USAGE);
  process.exit(0);
}

if (process.argv[2] === "search") {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(3),
      allowPositionals: true,
      options: { "max-price": { type: "string" }, limit: { type: "string" } },
    });
  } catch (e) {
    fail((e as Error).message);
  }
  const { values, positionals } = parsed!;
  const query = positionals.join(" ").trim();
  if (!query) fail("Missing <query>");
  const num = (name: string, s: string | undefined, int = false) => {
    if (s === undefined) return undefined;
    const n = Number(s);
    if (!Number.isFinite(n) || n < 0 || (int && (!Number.isInteger(n) || n < 1))) fail(`Invalid --${name}: ${s}`);
    return n;
  };
  const maxPrice = num("max-price", values["max-price"]);
  const limit = num("limit", values.limit, true);
  console.log(JSON.stringify(await searchDeals(query, undefined, { maxPrice, limit }), null, 2));
  process.exit(0);
}

const server = new McpServer({ name: "dealscout-mcp", version: "0.1.0" });

server.tool("search_deals", { query: z.string(), maxPrice: z.number().optional(), limit: z.number().int().positive().optional() }, async ({ query, maxPrice, limit }) => ({
  content: [{ type: "text", text: JSON.stringify(await searchDeals(query, undefined, { maxPrice, limit })) }],
}));

await server.connect(new StdioServerTransport());

