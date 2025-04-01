import { AuthProvider } from "./auth/AuthProvider";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import tailwindColors from "tailwindcss/colors";
import "./styles.css";

import { ErrorBoundary } from "react-error-boundary";

const colors = tailwindColors;

const queryClient = new QueryClient();

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
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              hashed: false,
              token: {
                // Tailwind OKLCH color replacements
                //TODO: use CSS vars
                blue: colors.blue[500], //
                purple: "oklch(0.627 0.265 303.9)", // purple.500
                cyan: "oklch(0.715 0.143 215.221)", // cyan.500
                green: "oklch(0.723 0.219 149.579)", // green.500
                magenta: "oklch(0.645 0.246 16.439)", // rose.500
                pink: "oklch(0.645 0.246 16.439)", // rose.500
                red: "oklch(0.637 0.237 25.331)", // red.500
                orange: "oklch(0.705 0.213 47.604)", // orange.500
                yellow: "oklch(0.795 0.184 86.047)", // yellow.500
                volcano: "oklch(0.705 0.213 47.604)", // orange.500
                geekblue: "oklch(0.623 0.214 259.815)", // blue.500
                gold: "oklch(0.769 0.188 70.08)", // amber.500
                lime: "oklch(0.768 0.233 130.85)", // lime.500
                // Your custom vars
                colorPrimary: "var(--primary)",
                colorPrimaryText: "var(--primary-foreground)",
                colorSuccess: "var(--chart-2)",
                colorWarning: "var(--chart-4)",
                colorError: "var(--destructive)",
                colorInfo: "var(--chart-3)",

                colorTextBase: "var(--foreground)",
                colorBgBase: "var(--background)",
                colorBgContainer: "var(--card)",

                colorBorder: "var(--border)",
                colorSplit: "var(--border)",
                colorTextPlaceholder: "var(--muted-foreground)",
                colorTextDisabled: "var(--muted-foreground)",
                colorFillSecondary: "var(--muted)",

                colorLink: "var(--primary)",
                colorLinkHover: "var(--accent)",
                colorLinkActive: "var(--accent-foreground)",

                controlOutline: "var(--ring)",
                colorBorderSecondary: "var(--input)",

                borderRadius: 10, // equals 0.625rem (from --radius)
              },
              components: {
                Layout: {
                  bodyBg: "var(--background)",
                  headerBg: "var(--background)",
                  colorText: "var(--foreground)",
                },
              },
            }}
          >
            <AppContent />
          </ConfigProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
