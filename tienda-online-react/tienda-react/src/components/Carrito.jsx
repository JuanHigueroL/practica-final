/**
 * Carrito.jsx
 * Columna derecha: muestra los items añadidos, permite modificar cantidades
 * (incrementar / decrementar) y lanza el pedido.
 */

import React from "react";

export default function Carrito({
  items,           // Array de { producto, cantidad }
  onIncrementar,   // (id) => void
  onDecrementar,   // (id) => void — quita 1 unidad; si llega a 0, elimina el item
  onRealizarPedido,
}) {
  // Precio total de todos los items del carrito
  const total = items.reduce(
    (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
    0
  );

  const carritoVacio = items.length === 0;

  return (
    <div className="carrito-panel sticky-top">
      <h4 className="mb-3 border-bottom pb-2">
        <i className="bi bi-cart3 me-2 text-primary" />
        Cesta{" "}
        {!carritoVacio && (
          <span className="badge bg-primary rounded-pill fs-6">
            {items.reduce((acc, i) => acc + i.cantidad, 0)}
          </span>
        )}
      </h4>

      {/* ── Estado vacío ── */}
      {carritoVacio ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-cart-x" style={{ fontSize: "3rem" }} />
          <p className="mt-2">Tu cesta está vacía</p>
        </div>
      ) : (
        <>
          {/* ── Lista de items ── */}
          <ul className="list-group list-group-flush mb-3">
            {items.map(({ producto, cantidad }) => (
              <li
                key={producto.id}
                className="list-group-item px-0 py-2"
              >
                <div className="d-flex align-items-start gap-2">
                  {/* Miniatura */}
                  <img
                    src={producto.imagenes[0]}
                    alt={producto.descripcion}
                    className="carrito-miniatura rounded"
                  />

                  {/* Descripción y precio */}
                  <div className="flex-grow-1">
                    <p className="mb-0 small fw-semibold lh-sm">
                      {producto.descripcion}
                    </p>
                    <p className="mb-1 text-muted" style={{ fontSize: "0.75rem" }}>
                      {producto.precio.toFixed(2)} € × {cantidad}
                    </p>
                    <span className="fw-bold text-primary small">
                      {(producto.precio * cantidad).toFixed(2)} €
                    </span>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="d-flex flex-column align-items-center gap-1">
                    <button
                      className="btn btn-outline-secondary btn-xs"
                      onClick={() => onIncrementar(producto.id)}
                      title="Añadir uno más"
                      /* Deshabilitado si el stock restante es 0 */
                      disabled={producto.stock <= 0}
                    >
                      <i className="bi bi-plus" />
                    </button>
                    <span className="badge bg-light text-dark border">
                      {cantidad}
                    </span>
                    <button
                      className="btn btn-outline-danger btn-xs"
                      onClick={() => onDecrementar(producto.id)}
                      title="Quitar uno"
                    >
                      <i className="bi bi-dash" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* ── Total ── */}
          <div className="d-flex justify-content-between align-items-center mb-3 border-top pt-3">
            <span className="fw-semibold">Total</span>
            <span className="fs-5 fw-bold text-primary">{total.toFixed(2)} €</span>
          </div>

          {/* ── Botón pedido ── */}
          <button
            className="btn btn-success w-100"
            onClick={onRealizarPedido}
          >
            <i className="bi bi-bag-check-fill me-2" />
            Realizar pedido
          </button>
        </>
      )}
    </div>
  );
}
