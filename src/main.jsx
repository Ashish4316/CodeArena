import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTheme } from "./utils/theme";
initTheme();
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Clean up legacy global localStorage data (one-time migration)
// This prevents old shared data from polluting new user-isolated storage
const cleanupLegacyData = () => {
  const migrationKey = "codearena_v2_migrated";
  if (localStorage.getItem(migrationKey)) return;
  
  // Remove old global keys that are now user-isolated
  const legacyKeys = [
    "progress",
    "dailyProgress", 
    "gamification_stats",
    "user_badges",
    "codearena_notes",
    "custom_sheets"
  ];
  
  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  localStorage.setItem(migrationKey, "true");
  console.log("Legacy localStorage data cleaned up for user isolation");
};

cleanupLegacyData();

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
