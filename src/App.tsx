import { AuthProvider } from "./auth/AuthProvider";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import "./styles.css";

const AppContent = () => {
  const [token] = useAtom(tokenAtom);
  const [view, setView] = useState<"login" | "dashboard">("login");

  useEffect(() => {
    if (token) {
      setView("dashboard");
    } else {
      setView("login");
    }
  }, [token]);

  return (
    <div>
      {view === "login" && (
        <Login
          onLoginSuccess={() => {
            setView("dashboard");
          }}
        />
      )}
      {view === "dashboard" && (
        <Dashboard
          onLogoutSuccess={() => {
            setView("login");
          }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
