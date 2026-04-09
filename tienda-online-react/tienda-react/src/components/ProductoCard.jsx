/**
 * ProductoCard.jsx
 * Tarjeta individual de producto.
 * Gestiona: visualización, efecto hover con carrusel, y botón de añadir al carrito.
 */

import React from "react";
import { useImageCarousel } from "../hooks/useImageCarousel";

export default function ProductoCard({ producto, onAgregarAlCarrito }) {
  const { id, codigo, descripcion, precio, stock, imagenes } = producto;

  // Hook del carrusel: sabe qué imagen mostrar y nos da los event handlers
  const { imagenActual, manejadores } = useImageCarousel(imagenes.length);

  // Sin stock disponible (todo está en el carrito u original a 0)
  const sinStock = stock <= 0;

  return (
    <div className={`card h-100 producto-card ${sinStock ? "sin-stock" : ""}`}>
      {/* ── Imagen con efecto hover + carrusel ── */}
      <div className="imagen-wrapper" {...manejadores}>
        <img
          src={imagenes[imagenActual]}
          alt={descripcion}
          className="card-img-top producto-imagen"
        />
        {/* Indicadores de imagen (bolitas) */}
        {imagenes.length > 1 && (
          <div className="imagen-indicadores">
            {imagenes.map((_, i) => (
              <span
                key={i}
                className={`indicador ${i === imagenActual ? "activo" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Información del producto ── */}
      <div className="card-body d-flex flex-column">
        <p className="text-muted small mb-1">
          <span className="badge bg-secondary">{codigo}</span>
        </p>
        <h6 className="card-title mb-1">{descripcion}</h6>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <div>
            <span className="fs-5 fw-bold text-primary">
              {precio.toFixed(2)} €
            </span>
            <br />
            <span className={`small ${sinStock ? "text-danger fw-bold" : "text-success"}`}>
              {sinStock ? "Sin stock" : `Stock: ${stock}`}
            </span>
          </div>

          {/* Botón deshabilitado si no hay stock */}
          <button
            className="btn btn-sm btn-primary"
            disabled={sinStock}
            onClick={() => onAgregarAlCarrito(id)}
            title={sinStock ? "Producto agotado" : "Añadir al carrito"}
          >
            {sinStock ? (
              <>
                <i className="bi bi-slash-circle me-1" />
                Agotado
              </>
            ) : (
              <>
                <i className="bi bi-cart-plus me-1" />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
