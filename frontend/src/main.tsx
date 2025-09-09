import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@/core/providers";
import App from "@/app/pages/App";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
