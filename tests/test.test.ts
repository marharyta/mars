import { test, expect } from "vitest";
import { groupByDay } from "../src/utils/groupBy";

const mockData = [
  { timestamp: 1742832000, ore_sites: 12 }, // Mar 25, 2025 00:00, Mon Mar 24 2025 18:00:00 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742841800, ore_sites: 27 }, // Mar 25, ~03:00, Mon Mar 24 2025 20:43:20 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742865600, ore_sites: 36 }, // Mar 25, ~10:00, Tue Mar 25 2025 03:20:00 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742900400, ore_sites: 18 }, // Mar 25, ~20:00, Tue Mar 25 2025 13:00:00 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742926800, ore_sites: 7 }, // Mar 26, ~03:00, Tue Mar 25 2025 20:20:00 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742961600, ore_sites: 33 }, // Mar 26, ~13:00, Wed Mar 26 2025 06:00:00 GMT+0200 (Eastern European Standard Time)
  { timestamp: 1742996400, ore_sites: 21 }, // Mar 27, ~00:00, Wed Mar 26 2025 15:40:00 GMT+0200 (Eastern European Standard Time)
];

test("test vitest", () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  expect(mockData).toHaveLength(7);
  expect(groupByDay(mockData, timezone)).toHaveLength(3);
  expect(groupByDay(mockData, timezone)[0]).toStrictEqual({
    date: "Mar 24",
    totalOreSites: 39,
  });
  expect(groupByDay(mockData, timezone)[1]).toStrictEqual({
    date: "Mar 25",
    totalOreSites: 61,
  });
  expect(groupByDay(mockData, timezone)[2]).toStrictEqual({
    date: "Mar 26",
    totalOreSites: 54,
  });
  expect(groupByDay(mockData, timezone)[3]).toBeUndefined();
});
