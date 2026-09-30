import React from "react";
import ReactDOM from "react-dom/client";
import App from "./LoginSignup/App.jsx";
import "./index.css";
import { initTheme } from "./LoginSignup/theme";

initTheme();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);