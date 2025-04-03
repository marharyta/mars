import { DateTime } from "luxon";
import type { OreExtended, OreType } from "../types";
import { Card, Typography, Spin, Badge } from "antd";
import { memo } from "react";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";

const { Text } = Typography;
interface Error {
  message: string;
}

// TODO: make sure Ore type is represented consistently
const OreSiteCard = memo(
  ({
    timestamp,
    detectedOres,
    index,
  }: {
    timestamp: number;
    detectedOres: {
      type: OreType;
      amount: number;
      distance: number;
      signalColor: "yellow";
    }[];
    index: number;
  }) => {
    const [timeZone] = useAtom(zone);

    const formattedDate = DateTime.fromSeconds(timestamp)
      .setZone(timeZone)
      .toFormat("MMM dd yyyy hh:mm:ss");

    const firstOfOre = detectedOres[0];

    return (
      <Card
        key={index}
        className="radius-xl shadow"
        style={{
          marginBottom: 16,
        }}
      >
        <Text className="!text-xs mb-3 block font-bold flex items-baseline gap-2">
          <div
            className={`shadow-[0px_0px_4px_2px_rgba(234,_179,_8,_0.3)] w-2 h-2 rounded-full bg-${firstOfOre?.signalColor}-300`}
          ></div>
          Ore Site Update
        </Text>
        {firstOfOre?.type && (
          <div className="rounded-xl border py-0.5 px-3 w-min text-xs lowercase font-medium my-2">
            {firstOfOre?.type}
          </div>
        )}
        <Text type="secondary">
          Timestamp: {formattedDate} {timeZone}
        </Text>
        <div className="mt-3">
          <Text strong>Total Ore Sites: </Text>
          <Text>{detectedOres?.length}</Text>
        </div>
      </Card>
    );
  }
);

export const DataList = ({
  data,
  loading,
  error,
}: {
  data: OreExtended[];
  loading: Boolean;
  error: Error | null;
}) => {
  {
    /*
    TODO: 
        1. add react-virtualized later ?
    */
  }

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

  //TODO: refactor out the h-[280px] number
  return (
    <ul className="h-[280px] overflow-y-auto">
      {data?.map((d, index) => (
        <li key={index}>
          <OreSiteCard
            key={index}
            timestamp={d.timestamp}
            detectedOres={d.detectedOres}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
};
