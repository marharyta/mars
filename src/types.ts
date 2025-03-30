export interface User {
  user_id: string;
  name?: string;
  password?: string;
}

export interface DashboardProps {
  onLogoutSuccess: () => void;
}

export interface LoginProps {
  onLoginSuccess: () => void;
}

export interface AuthContextType {
  token: string | null;
  login: (user_id: string, password: string) => Promise<void>;
  logout: () => void;
}
