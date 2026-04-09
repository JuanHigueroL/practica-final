/**
 * CategoriaAcordeon.jsx
 * Muestra el nombre de la categoría como cabecera clicable (acordeón)
 * y la cuadrícula de productos debajo con transición de altura CSS.
 */

import React, { useState } from "react";
import ProductoCard from "./ProductoCard";

export default function CategoriaAcordeon({
  categoria,
  productos,
  onAgregarAlCarrito,
}) {
  const [abierta, setAbierta] = useState(true); // Abiertas por defecto

  // Contamos cuántos productos quedan con stock para el badge informativo
  const conStock = productos.filter((p) => p.stock > 0).length;

  return (
    <div className="categoria-acordeon mb-4">
      {/* ── Cabecera clicable ── */}
      <button
        className="categoria-header w-100 d-flex justify-content-between align-items-center"
        onClick={() => setAbierta((prev) => !prev)}
        aria-expanded={abierta}
      >
        <span className="fs-5 fw-semibold">
          <i className={`bi bi-chevron-${abierta ? "down" : "right"} me-2`} />
          {categoria}
        </span>
        <span className="badge bg-primary rounded-pill">
          {conStock} / {productos.length} disponibles
        </span>
      </button>

      {/* ── Contenido con transición CSS via clase ── */}
      <div className={`categoria-contenido ${abierta ? "visible" : "oculto"}`}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 pt-3">
          {productos.map((producto) => (
            <div className="col" key={producto.id}>
              <ProductoCard
                producto={producto}
                onAgregarAlCarrito={onAgregarAlCarrito}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
