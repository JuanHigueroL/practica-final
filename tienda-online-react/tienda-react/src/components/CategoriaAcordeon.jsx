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
  const [abierta, setAbierta] = useState(true);

  const conStock = productos.filter((p) => p.stock > 0).length;

  return (
    <div className="mb-4">
      {/* ── Cabecera clicable ── */}
      <button
        className="categoria-header w-100 d-flex justify-content-between align-items-center border-0"
        onClick={() => setAbierta((prev) => !prev)}
        aria-expanded={abierta}
      >
        <span className="fs-5 fw-bold d-flex align-items-center gap-2">
          <i
            className={`bi bi-chevron-down text-primary transition-smooth`}
            style={{ transform: abierta ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.3s ease" }}
          />
          {categoria}
        </span>
        <span className="badge rounded-pill px-3 py-2 fs-6">
          {conStock} / {productos.length}
        </span>
      </button>

      {/* ── Contenido con transición CSS grid via clase ── */}
      <div className={`categoria-contenido ${abierta ? "" : "oculto"}`}>
        <div> {/* Este div interno es necesario para que el grid-template-rows funcione correctamente (ocultando overflow) */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 pt-3 pb-2 px-1">
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
    </div>
  );
}
