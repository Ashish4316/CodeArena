import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTheme } from "./utils/theme";
initTheme();
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
