import { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import type { OreExtended } from "../types";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";
import { groupByDay } from "../utils/groupBy";
import { Spin } from "antd";

interface Error {
  message: string;
}

// TODO: this component could use more refactoring to follow single responsibility principle
export const OresHistogram = ({
  data,
  loading,
  error,
}: {
  data: OreExtended[];
  loading: Boolean;
  error: Error | null;
}) => {
  if (error)
    return (
      <div className="relative h-full rounded border">
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          <div role="alert">
            <p>Featching aquisitions data</p>
            <pre>{error.message}</pre>
          </div>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="relative h-full rounded border">
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          <Spin />
        </div>
      </div>
    );

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Column>(null);
  const [timeZone] = useAtom(zone);

  useEffect(() => {
    if (!containerRef.current || !data?.length) return;
    const histogramData = groupByDay(data, timeZone).map((point) => ({
      time: point.date,
      ores: point.totalOreSites,
    }));

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
      // TODO: add this to cause error
      // color: `${colors.blue[400]}`,
      color: `orange`,
    });

    histogram.render();
    chartRef.current = histogram;

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, timeZone]);

  return <div ref={containerRef} className="w-full h-[280px]" />;
};
