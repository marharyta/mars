import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { setUserAtom } from "./atoms/user";
import { useSetAtom } from "jotai";
import type { LoginProps } from "./types";
import { Input, Button, Typography, Form, Layout, Card } from "antd";

const { Title } = Typography;

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [user_id, setUserId] = useState("alice");
  const [password, setPassword] = useState("1234");
  const { login } = useAuth();

  const setUser = useSetAtom(setUserAtom);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <Layout
      style={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title={<Title level={2}>Login</Title>} style={{ width: 300 }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="User ID" name="user_id">
            <Input
              value={user_id}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
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
    </Layout>
  );
};
