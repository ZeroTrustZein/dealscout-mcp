import type { Deal, DealSource } from "./types.js";
export type { Deal };

export const sources: DealSource[] = []; // register real sources here

export async function searchDeals(query: string, srcs: DealSource[] = sources): Promise<Deal[]> {
  const results = await Promise.allSettled(srcs.map((s) => s.search(query)));
  const seen = new Map<string, Deal>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const d of r.value) if (!seen.has(d.url)) seen.set(d.url, d);
  }
  return [...seen.values()].sort((a, b) => a.price - b.price);
}
