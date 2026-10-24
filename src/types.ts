export type Deal = {
  title: string;
  price: number;
  url: string;
  currency?: string;
  source?: string;
};

export type DealSource = {
  name: string;
  search(query: string): Promise<Deal[]>;
};
