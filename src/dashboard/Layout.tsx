import { useAuth } from "../auth/AuthProvider";
import { Row, ColProps, Col } from "antd";
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

interface DashboardCellProps extends ColProps {
  span?: number;
  children: ReactNode;
}

export function DashboardCell({
  span = 12,
  children,
  ...props
}: DashboardCellProps) {
  return (
    <Col span={span} {...props}>
      {children}
    </Col>
  );
}
