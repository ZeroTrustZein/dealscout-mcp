export type Deal = { title: string; price: number; url: string };

export async function searchDeals(_query: string): Promise<Deal[]> {
  return []; // TODO stage 2+: real sources
}
