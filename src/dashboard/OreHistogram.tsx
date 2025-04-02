import { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import { DateTime } from "luxon";
import tailwindColors from "tailwindcss/colors";
import type { Ore } from "../types";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";

const colors = tailwindColors;

export const OresHistogram = ({ data }: { data: Ore[] }) => {
  const sortedData = [...data].sort((a, b) =>
    a.timestamp > b.timestamp ? 1 : -1
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Column>(null);
  const [timeZone] = useAtom(zone);

  console.log("colors.blue[400]", colors.blue[400]);

  useEffect(() => {
    if (!containerRef.current) return;

    const timeBuckets = new Map<string, number>();

    sortedData?.forEach(({ timestamp }) => {
      const day = DateTime.fromSeconds(Number(timestamp))
        .setZone(timeZone)
        .toFormat("MMM dd");

      timeBuckets.set(day, (timeBuckets.get(day) || 0) + 1);
    });

    const dataCopy = [...data];

    dataCopy.forEach(({ timestamp, ore_sites }) => {
      const day = DateTime.fromSeconds(Number(timestamp))
        .setZone(timeZone)
        .toFormat("MMM dd");

      timeBuckets.set(day, (timeBuckets.get(day) || 0) + ore_sites);
    });

    const histogramData = Array.from(timeBuckets.entries())
      .map(([time, ores]) => ({ time, ores }))
      .sort(
        (a, b) =>
          DateTime.fromFormat(a.time, "MMM dd").toMillis() -
          DateTime.fromFormat(b.time, "MMM dd").toMillis()
      );

    const histogram = new Column(containerRef.current, {
      data: histogramData,
      xField: "time",
      yField: "ores",
      xAxis: {
        title: { text: "Date" },
      },
      yAxis: {
        title: { text: "Total Ore Sites" },
      },
      tooltip: {
        fields: ["time", "ores"],
        formatter: (datum) => ({
          name: "Ore Sites",
          value: datum.ores,
        }),
      },
      //TODO: add this to cause error
      // color: `${colors.blue[400]}`,
    });

    histogram.render();
    chartRef.current = histogram;

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, timeZone]);

  return <div ref={containerRef} style={{ width: "100%", height: 400 }} />;
};
