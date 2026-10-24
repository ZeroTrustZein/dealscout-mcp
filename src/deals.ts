import type { Deal } from "./types.js";
export type { Deal };

export async function searchDeals(_query: string): Promise<Deal[]> {
  return []; // TODO stage 2+: real sources
}
