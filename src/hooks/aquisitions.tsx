import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { useRef } from "react";
import type { OreExtended } from "../types";

const SERVER_URL = "https://server-ancient-butterfly-346.fly.dev";
// TODO: configure proper VITE to VERCEL env variable transfer
// process.env.APP_ENV === "production"
//   ? "https://server-ancient-butterfly-346.fly.dev"
//   : "http://localhost:8080";

{
  /*
      To identify Ore, we need and Ore detector, they  it displays up to 5 ore 
      locations as Signals .  
      Ore Detector is an entry-level functional block in Space Engineers. 
      When attached to a ship and 
      supplied with power, it displays up to 5 ore locations as Signals 
      on the player's HUD when they are 
      within detection range — exactly like the Hand Drill does, but with 
      possibly greater range. 
  */
}
// Mars-specific ore types
const ORE_TYPES = ["Magnesium", "Aluminium", "Titanium", "Iron", "Chromium"];

export const useAcquisitionsFetcher = () => {
  const [token] = useAtom(tokenAtom);
  const previousDataRef = useRef<OreExtended[] | null>(null);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["acquisitions", 1],
    queryFn: () =>
      fetch(`${SERVER_URL}/acquisitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    select: (newData) => {
      const prev = previousDataRef.current;
      // Enrich raw data
      const enriched = newData.map((item: any) => {
        const detectedOres = Array.from({ length: item.ore_sites }).map(
          (_, i) => ({
            type: ORE_TYPES[Math.floor(Math.random() * ORE_TYPES.length)],
            amount: parseFloat((Math.random() * 2000).toFixed(2)),
            distance: parseFloat((Math.random() * 150).toFixed(2)),
            signalColor: "yellow",
          })
        );

        return {
          ore_sites: item.ore_sites,
          timestamp: item.timestamp,
          detectorRange: 150.0,
          location: {
            x: parseFloat((Math.random() * 100000).toFixed(3)),
            y: parseFloat((Math.random() * 100000).toFixed(3)),
            z: parseFloat((Math.random() * 100000).toFixed(3)),
          },
          detectedOres,
        };
      });

      // COMMENT: for not enrisched data

      // const isEqual =
      //   Array.isArray(prev) &&
      //   prev?.length === newData.length &&
      //   prev?.every((item: Ore, index: number) => {
      //     const newItem = newData[index];
      //     return (
      //       item.timestamp === newItem.timestamp &&
      //       item.ore_sites === newItem.ore_sites
      //     );
      //   });

      // if (!isEqual) {
      //   previousDataRef.current = newData;
      //   return newData.sort((a: Ore, b: Ore) => b.timestamp - a.timestamp);
      // }

      // return prev.sort((a, b) => b.timestamp - a.timestamp);

      const isEqual =
        Array.isArray(prev) &&
        prev?.length === enriched.length &&
        prev?.every((item: OreExtended, index: number) => {
          const newItem = enriched[index];
          return (
            item.timestamp === newItem.timestamp &&
            item.detectedOres?.length === newItem.detectedOres?.length
          );
        });

      if (!isEqual) {
        previousDataRef.current = enriched;
        return enriched.sort(
          (a: OreExtended, b: OreExtended) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }

      return prev.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
  });

  return { data, loading, error };
};
