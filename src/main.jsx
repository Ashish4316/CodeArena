import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTheme } from "./utils/theme";
initTheme();
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
