import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { setUserAtom } from "./atoms/user";
import { useSetAtom } from "jotai";
import type { LoginProps } from "./types";
import { Layout, Button, Typography, Form, Input, Card } from "antd";
const { Title } = Typography;
const { Content } = Layout;

export const Login = ({ onLoginSuccess }: LoginProps) => {
  //TODO: remove hardcoded values
  const [user_id, setUserId] = useState("alice");
  const [password, setPassword] = useState("1234");
  const { login } = useAuth();

  const setUser = useSetAtom(setUserAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    //TODO: fix that, git broken after introduction of ant design
    e.preventDefault();
    try {
      setUser({ user_id: user_id, name: "", password: "" });
      await login(user_id, password);
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed!", error);
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
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
