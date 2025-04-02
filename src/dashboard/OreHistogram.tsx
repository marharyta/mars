import { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import { DateTime } from "luxon";
import tailwindColors from "tailwindcss/colors";
import type { Ore } from "../types";

const colors = tailwindColors;

export const OresHistogram = ({ data }: { data: Ore[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Column>(null);

  console.log("colors.blue[400]", colors.blue[400]);

  useEffect(() => {
    if (!containerRef.current) return;

    const timeBuckets = new Map<string, number>();

    data?.forEach(({ timestamp }) => {
      const day = DateTime.fromSeconds(timestamp).toFormat("yyyy-MM-dd");
      timeBuckets.set(day, (timeBuckets.get(day) || 0) + 1);
    });

    const histogramData = Array.from(timeBuckets.entries())
      .map(([time, ores]) => ({
        time,
        ores,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    const histogram = new Column(containerRef.current, {
      data: histogramData,
      xField: "time",
      yField: "ores",
      xAxis: {
        title: { text: "Date" },
        label: {
          rotate: 45,
        },
      },
      yAxis: {
        title: { text: "Number of entries" },
      },
      tooltip: {
        fields: ["time", "count"],
      },
      //TODO: add this to cause error
      // color: `${colors.blue[400]}`,
    });

    histogram.render();
    chartRef.current = histogram;

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: "100%", height: 400 }} />;
};
