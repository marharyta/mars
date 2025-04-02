import { useAuth } from "../auth/AuthProvider";
import { Row, Col } from "antd";
import { ReactNode } from "react";

interface DashboardLayoutApi {
  logout: () => void;
}

export const DashboardLayout = ({
  children,
}: {
  children: (renderProps: { api: DashboardLayoutApi }) => ReactNode;
}) => {
  const { logout } = useAuth();
  return (
    <Row gutter={[16, 16]}>
      {children({
        api: { logout },
      })}
    </Row>
  );
};

export function DashboardCell({
  span = 12,
  children,
}: {
  span?: number;
  children: ReactNode;
}) {
  return <Col span={span}>{children}</Col>;
}
