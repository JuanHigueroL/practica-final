/**
 * ProductoCard.jsx
 * ProductoCard lo que hace es recibir la información de un producto específico y la función 
   principal del botón de compra. Nada más iniciar, lo que hace es:
  - Extraer (desestructurar) todos los datos necesarios del producto: id, código, descripción, 
    precio, stock e imágenes.
  - Llamar al custom hook useImageCarousel pasándole la cantidad total de fotos para obtener 
    el número de la imagen actual y los manejadores (eventos del ratón para el carrusel).
  - Calcular la variable sinStock comprobando si el stock es menor o igual a cero.
  - Por último, devuelve la vista de la tarjeta (JSX) que hace lo siguiente:
      * Aplica una clase visual "sin-stock" al contenedor principal si el producto está agotado.
      * Muestra el código identificador como una pequeña etiqueta flotante.
      * Construye el contenedor de la imagen conectándole los manejadores, dibuja unos puntos 
        indicadores si hay más de una foto, o muestra un marcador de "No Image" si el producto 
        viene sin fotos.
      * Muestra la descripción, el precio formateado a dos decimales, y el texto del stock 
        (en rojo con una cruz si está agotado, o con un tic si hay unidades).
      * Renderiza el botón final, el cual se bloquea y cambia su icono a una "X" si no hay stock. 
        Si hay stock, permite hacer clic y ejecuta la acción onAgregarAlCarrito enviándole el ID 
        del producto.
 */

import React from "react";
import { useImageCarousel } from "../hooks/useImageCarousel";

export default function ProductoCard({ producto, onAgregarAlCarrito }) {
  // un producto es un objeto que contiene:
  // id, codigo, descripcion, precio, stock, imagenes
  const { id, codigo, descripcion, precio, stock, imagenes } = producto;

  // Devuelve la imagen actual y los manejadores del carrusel
  const { imagenActual, manejadores } = useImageCarousel(imagenes.length);

  // Cuando stock es menor o igual a 0, sinStock es true
  const sinStock = stock <= 0;

  return (
    <div className={`producto-card d-flex flex-column position-relative ${sinStock ? "sin-stock" : ""}`}>
      {/* Muestra el código del producto*/}
      <div className="position-absolute top-0 start-0 m-3 z-3">
        <span className="badge bg-light text-dark fw-semibold shadow-sm rounded-pill px-3 py-2 border">
          {codigo}
        </span>
      </div>

      {/* Muestra la imagen del producto y hace de carrusel*/}
      <div className="imagen-wrapper" {...manejadores}>
        {imagenes && imagenes.length > 0 ? (
          <>
            <img
              src={imagenes[imagenActual]}
              alt={descripcion}
              className="producto-imagen"
            />
            {/* Indicadores de imagen */}
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

      {/* ── Información del producto, sin stock se pone rojo y con una x y se deshabilita el botón */}
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
