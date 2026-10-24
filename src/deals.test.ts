import { expect, test } from "vitest";
import { searchDeals } from "./deals.js";

test("searchDeals returns array", async () => {
  expect(await searchDeals("laptop")).toEqual([]);
});
