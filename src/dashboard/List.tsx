import { DateTime } from "luxon";
import type { Ore } from "../types";
import { Card, Typography, Spin } from "antd";
import { memo } from "react";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";

const { Text } = Typography;
interface Error {
  message: string;
  description: string;
  statusCode: string | number;
}

// TODO: make sure Ore type is represented consistently
const OreSiteCard = memo(
  ({
    timestamp,
    ore_sites,
    index,
  }: {
    timestamp: number;
    ore_sites: number;
    index: number;
  }) => {
    const [timeZone] = useAtom(zone);

    const formattedDate = DateTime.fromSeconds(timestamp)
      .setZone(timeZone)
      .toFormat("MMM dd yyyy hh:mm:ss");

    return (
      <Card
        key={index}
        className="radius-xl shadow"
        style={{
          marginBottom: 16,
        }}
      >
        <Text className="!text-xs mb-3 block font-bold">Ore Site Update</Text>
        <Text type="secondary">
          Timestamp: {formattedDate} {timeZone}
        </Text>
        <div className="mt-3">
          <Text strong>Total Ore Sites: </Text>
          <Text>{ore_sites}</Text>
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
  data: Ore[];
  loading: Boolean;
  error: Error;
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
            ore_sites={d.ore_sites}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
};
