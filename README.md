# dealscout-mcp

MCP server (stdio) + CLI for deal search. Queries all registered sources in parallel, dedupes by URL, filters, sorts by price ascending.

> No sources registered yet (`sources` in `src/deals.ts` is empty), so searches return `[]` until you add one.

## Setup

    npm i && npm run build && npm test

Dev: `npm run dev`. Run built: `npm start`.

## MCP server

No args = stdio server. Example client config:

    { "mcpServers": { "dealscout": { "command": "node", "args": ["<path>/dist/index.js"] } } }

Tool `search_deals`:

| param | type | required | note |
|---|---|---|---|
| `query` | string | yes | |
| `maxPrice` | number | no | keep deals with `price <= maxPrice` |
| `limit` | positive int | no | max results (after sort) |

Returns text content: JSON array of `Deal`.

## CLI

    dealscout-mcp search <query> [--max-price N] [--limit N]

Prints JSON array to stdout.

## Deal shape

    { title: string, price: number, url: string, currency?: string, source?: string }

## Adding a source

Implement `DealSource` (`src/types.ts`) and push it into `sources` in `src/deals.ts`:

    { name: string, search(query: string): Promise<Deal[]> }

- Each source has a 5s timeout (`timeoutMs`); slow or failing sources are skipped, not fatal.
- Duplicate `url`s: first one wins.
- Prices are compared as raw numbers; `currency` is not converted.

## CI

`.github/workflows`: build + test.
