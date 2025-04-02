import { DateTime } from "luxon";
import type { Ore } from "../types";

export const groupByDay = (data: Ore[], timezone: any) => {
  return Object.entries(
    data.reduce<Record<string, number>>((acc, { timestamp, ore_sites }) => {
      const day = DateTime.fromSeconds(timestamp)
        .setZone(timezone)
        .toFormat("MMM dd");

      return {
        ...acc,
        [day]: (acc[day] ?? 0) + ore_sites,
      };
    }, {})
  )
    .map(([date, totalOreSites]) => ({ date, totalOreSites }))
    .sort((a, b) =>
      DateTime.fromFormat(a.date, "MMM dd") <
      DateTime.fromFormat(b.date, "MMM dd")
        ? -1
        : 1
    );
};
