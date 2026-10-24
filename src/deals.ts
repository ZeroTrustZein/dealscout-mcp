import type { Deal, DealSource } from "./types.js";
export type { Deal };

export const sources: DealSource[] = []; // register real sources here

export type Opts = { maxPrice?: number; limit?: number; timeoutMs?: number };

const timeout = <T>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms).unref())]);

export async function searchDeals(query: string, srcs: DealSource[] = sources, o: Opts = {}): Promise<Deal[]> {
  const results = await Promise.allSettled(srcs.map((s) => timeout(s.search(query), o.timeoutMs ?? 5000)));
  const seen = new Map<string, Deal>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const d of r.value) if (!seen.has(d.url)) seen.set(d.url, d);
  }
  return [...seen.values()]
    .filter((d) => o.maxPrice === undefined || d.price <= o.maxPrice)
    .sort((a, b) => a.price - b.price)
    .slice(0, o.limit);
}

