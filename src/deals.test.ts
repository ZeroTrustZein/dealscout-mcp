import { expect, test } from "vitest";
import { searchDeals } from "./deals.js";
import type { DealSource } from "./types.js";

test("searchDeals returns array", async () => {
  expect(await searchDeals("laptop")).toEqual([]);
});

test("merges, dedupes by url, sorts by price, survives failing source", async () => {
  const a: DealSource = { name: "a", search: async () => [{ title: "x", price: 9, url: "u1" }, { title: "y", price: 5, url: "u2" }] };
  const b: DealSource = { name: "b", search: async () => [{ title: "x2", price: 8, url: "u1" }] };
  const bad: DealSource = { name: "bad", search: async () => { throw new Error("boom"); } };
  const r = await searchDeals("q", [a, b, bad]);
  expect(r.map((d) => d.url)).toEqual(["u2", "u1"]);
});
