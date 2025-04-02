import { useQuery } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { Button } from "antd";
import type { Ore } from "../types";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { ReactNode } from "react";

// Container component
export const AcquisitionsFetcher = ({
  children,
}: {
  children: (renderProps: { state: Ore[] }) => ReactNode;
}) => {
  const [token] = useAtom(tokenAtom);
  const { resetBoundary } = useErrorBoundary();

  const {
    data: acquisitions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["acquisitions", 1],
    queryFn: () =>
      fetch(`http://localhost:8080/acquisitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  {
    /* I wish there was pagination */
  }
  // if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorMessage error={error} />;
  // if (!user) return <NotFound message="User not found" />;
  if (error)
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
        <Button onClick={resetBoundary}>Try again</Button>
      </div>
    );
  if (isLoading) return <p>Is loading aquisitions</p>;

  return (
    <>
      {children({
        state: acquisitions,
      })}
    </>
  );
};
