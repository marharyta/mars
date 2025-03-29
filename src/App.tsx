import { useAuth, AuthProvider } from "./auth/AuthProvider";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react";

const AppContent = () => {
  const { token } = useAuth();
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
        <Login onLoginSuccess={() => setView("dashboard")} />
      )}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
};

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}

export default App;
