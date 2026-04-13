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
    <div className={`producto-card d-flex flex-column position-relative ${sinStock ? "sin-stock" : ""}`}>
      {/* Badge Flotante para el código/categoría */}
      <div className="position-absolute top-0 start-0 m-3 z-3">
        <span className="badge bg-light text-dark fw-semibold shadow-sm rounded-pill px-3 py-2 border">
          {codigo}
        </span>
      </div>

      {/* ── Imagen con efecto hover + carrusel ── */}
      <div className="imagen-wrapper" {...manejadores}>
        {imagenes && imagenes.length > 0 ? (
          <>
            <img
              src={imagenes[imagenActual]}
              alt={descripcion}
              className="producto-imagen"
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
          </>
        ) : (
          <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center text-muted bg-light">
            <i className="bi bi-image" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
            <span className="fw-semibold mt-2" style={{ opacity: 0.7 }}>No Image</span>
          </div>
        )}
      </div>

      {/* ── Información del producto ── */}
      <div className="card-body d-flex flex-column h-100">
        <h5 className="card-title fw-bold text-truncate mb-2">{descripcion}</h5>
        
        <div className="mt-auto d-flex justify-content-between align-items-end pt-3">
          <div>
            <div className="fs-4 fw-bolder text-primary lh-1 mb-1">
              {precio.toFixed(2)} €
            </div>
            <div className={`small fw-semibold ${sinStock ? "text-danger" : "text-muted"}`}>
              {sinStock ? "❌ Agotado" : `✓ Stock: ${stock}`}
            </div>
          </div>

          <button
            className="btn btn-primary rounded-circle p-2 d-flex justify-content-center align-items-center"
            style={{ width: "45px", height: "45px" }}
            disabled={sinStock}
            onClick={() => onAgregarAlCarrito(id)}
            title={sinStock ? "Producto agotado" : "Añadir al carrito"}
          >
            {sinStock ? (
              <i className="bi bi-x-lg fs-5" />
            ) : (
              <i className="bi bi-cart-plus-fill fs-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
