import { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import { DateTime } from "luxon";
import tailwindColors from "tailwindcss/colors";
import type { Ore } from "../types";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";
import { groupByDay } from "../utils/groupBy";
import { Skeleton } from "antd";

const colors = tailwindColors;

export const OresHistogram = ({
  data,
  loading,
  error,
}: {
  data: Ore[];
  loading: Boolean;
  error: any;
}) => {
  console.log("OresHistogram re-render");
  if (error)
    return (
      <div role="alert">
        <p>Featching aquisitions data</p>
        <pre>{error.message}</pre>
      </div>
    );

  if (loading) return <Skeleton active paragraph={{ rows: 1 }} />;

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Column>(null);
  const [timeZone] = useAtom(zone);

  console.log("colors.blue[400]", colors.blue[400]);

  useEffect(() => {
    if (!containerRef.current || !data?.length) return;
    const histogramData = groupByDay(data, timeZone)
      .map((point) => ({ time: point.date, ores: point.totalOreSites }))
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
        title: { text: "Date (Month Day)" },
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
