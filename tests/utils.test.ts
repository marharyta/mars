import { test, expect } from "vitest";
import { groupByDay } from "../src/utils/groupBy";

const mockData = [
  { timestamp: 1742832000, ore_sites: 12 },
  // Mon Mar 24 2025 18:00:00 GMT+0200 (Eastern European Standard Time),
  // Tuesday March 25, 2025 01:00:00 (am) in time zone Asia/Tokyo (JST)
  { timestamp: 1742841800, ore_sites: 27 },
  // Mon Mar 24 2025 20:43:20 GMT+0200 (Eastern European Standard Time),
  // Tuesday March 25, 2025 03:43:20 (am) in time zone Asia/Tokyo (JST)
  { timestamp: 1742865600, ore_sites: 36 },
  // Tue Mar 25 2025 03:20:00 GMT+0200 (Eastern European Standard Time)
  // Tuesday March 25, 2025 10:20:00 (am) in time zone Asia/Tokyo (JST)
  { timestamp: 1742900400, ore_sites: 18 },
  // Tue Mar 25 2025 13:00:00 GMT+0200 (Eastern European Standard Time)
  // Tuesday March 25, 2025 20:00:00 (pm) in time zone Asia/Tokyo (JST)
  { timestamp: 1742926800, ore_sites: 7 },
  // Tue Mar 25 2025 20:20:00 GMT+0200 (Eastern European Standard Time)
  // Wednesday March 26, 2025 03:20:00 (am) in time zone Asia/Tokyo (JST)
  { timestamp: 1742961600, ore_sites: 33 },
  // Wed Mar 26 2025 06:00:00 GMT+0200 (Eastern European Standard Time)
  // Wednesday March 26, 2025 13:00:00 (pm) in time zone Asia/Tokyo (JST)
  { timestamp: 1742996400, ore_sites: 21 },
  // Wed Mar 26 2025 15:40:00 GMT+0200 (Eastern European Standard Time)
  // Wednesday March 26, 2025 22:40:00 (pm) in time zone Asia/Tokyo (JST)
];

test("test groupByDay to group with respect to timezone", () => {
  const timezoneHelsinki = "Europe/Helsinki";
  const timezoneTokyo = "Asia/Tokyo";
  expect(mockData).toHaveLength(7);
  expect(groupByDay(mockData, timezoneHelsinki)).toHaveLength(3);
  expect(groupByDay(mockData, timezoneHelsinki)[0]).toStrictEqual({
    date: "Mar 24",
    totalOreSites: 39,
  });
  expect(groupByDay(mockData, timezoneHelsinki)[1]).toStrictEqual({
    date: "Mar 25",
    totalOreSites: 61,
  });
  expect(groupByDay(mockData, timezoneHelsinki)[2]).toStrictEqual({
    date: "Mar 26",
    totalOreSites: 54,
  });
  expect(groupByDay(mockData, timezoneHelsinki)[3]).toBeUndefined();

  expect(groupByDay(mockData, timezoneTokyo)).toHaveLength(2);
  expect(groupByDay(mockData, timezoneTokyo)[0]).toStrictEqual({
    date: "Mar 25",
    totalOreSites: 93,
  });

  expect(groupByDay(mockData, timezoneTokyo)[1]).toStrictEqual({
    date: "Mar 26",
    totalOreSites: 61,
  });
});
