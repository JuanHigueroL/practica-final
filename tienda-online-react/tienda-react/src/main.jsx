/**
 * main.jsx
 * Punto de entrada estándar de Vite + React.
 * Importamos Bootstrap 5 CSS aquí para que esté disponible globalmente y se llama
 * a App.jsx que contiene toda la lógica de la aplicación, de esta forma 
 * mantenemos la aplicación organizada y modular
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap Icons (instala con: npm install bootstrap-icons)
import "bootstrap-icons/font/bootstrap-icons.css";

// Bootstrap JS Bundle (para que funcionen los modales)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);