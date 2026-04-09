/**
 * main.jsx
 * Punto de entrada estándar de Vite + React.
 * Importamos Bootstrap 5 CSS aquí para que esté disponible globalmente.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap Icons (instala con: npm install bootstrap-icons)
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
