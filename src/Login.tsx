import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { setUserAtom } from "./atoms/user";
import { useSetAtom } from "jotai";
import type { LoginProps } from "./types";
import { Layout, Typography, Form, Input, Card } from "antd";
import { GradientButton } from "./components/ui/gradient-button";

const { Title, Text } = Typography;
const { Content } = Layout;

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [user_id, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  const setUser = useSetAtom(setUserAtom);

  const handleSubmit = async () => {
    //TODO: fix that, git broken after introduction of ant design
    try {
      setUser({ user_id: user_id, name: "", password: "" });
      await login(user_id, password);
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed!", error);
      const errorMessage = error?.toString();
      setLoginError(errorMessage as string);
    }
  };

  return (
    <Layout className="h-dvh">
      <Content className="flex flex-col items-center aling-center justify-center">
        <Card
          title={
            <Title level={2} className="font-bold">
              login
            </Title>
          }
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="user_id">
              <Input
                value={user_id}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <GradientButton className="w-full" type="submit">
                Login
              </GradientButton>
            </Form.Item>
          </Form>
          {loginError && <Text className="text-red-600">{loginError}</Text>}
        </Card>
      </Content>
    </Layout>
  );
};
