import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { useRef } from "react";
import type { Ore } from "../types";

const SERVER_URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://server-ancient-butterfly-346.fly.dev/8080"
    : "http://localhost:8080";

export const useAcquisitionsFetcher = () => {
  const [token] = useAtom(tokenAtom);
  const previousDataRef = useRef<Ore[] | null>(null);

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

      const isEqual =
        Array.isArray(prev) &&
        prev?.length === newData.length &&
        prev?.every((item: Ore, index: number) => {
          const newItem = newData[index];
          return (
            item.timestamp === newItem.timestamp &&
            item.ore_sites === newItem.ore_sites
          );
        });

      if (!isEqual) {
        previousDataRef.current = newData;
        return newData.sort((a: Ore, b: Ore) => b.timestamp - a.timestamp);
      }

      return prev.sort((a, b) => b.timestamp - a.timestamp);
    },
  });

  return { data, loading, error };
};
