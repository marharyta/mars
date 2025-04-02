import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { useRef } from "react";

export const useAcquisitionsFetcher = () => {
  const [token] = useAtom(tokenAtom);
  const previousDataRef = useRef(null);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["acquisitions", 1],
    queryFn: () =>
      fetch(`http://localhost:8080/acquisitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    select: (newData) => {
      const prev = previousDataRef.current;

      const isEqual =
        Array.isArray(prev) &&
        prev.length === newData.length &&
        prev.every((item, index) => {
          const newItem = newData[index];
          return (
            item.timestamp === newItem.timestamp &&
            item.ore_sites === newItem.ore_sites
          );
        });

      if (!isEqual) {
        previousDataRef.current = newData;
        return newData.sort((a, b) => b.timestamp - a.timestamp);
      }

      // If equal, return the previous to avoid triggering rerenders
      return prev.sort((a, b) => b.timestamp - a.timestamp);
    },
  });

  return { data, loading, error };
};
