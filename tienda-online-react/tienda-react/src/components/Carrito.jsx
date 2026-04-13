/**
 * Carrito.jsx
 * Columna derecha: muestra los items añadidos, permite modificar cantidades
 * (incrementar / decrementar) y lanza el pedido.
 */

import React from "react";

export default function Carrito({
  items,
  onIncrementar,
  onDecrementar,
  onRealizarPedido,
}) {
  const total = items.reduce(
    (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
    0
  );

  const carritoVacio = items.length === 0;

  return (
    <div className="carrito-panel">
      <h4 className="mb-4 d-flex align-items-center">
        <i className="bi bi-cart-check fs-3 me-2 text-primary" />
        <span className="fw-bold fs-4">Mi Cesta</span>
        {!carritoVacio && (
          <span className="badge bg-primary rounded-pill ms-auto">
            {items.reduce((acc, i) => acc + i.cantidad, 0)} items
          </span>
        )}
      </h4>

      {/* ── Estado vacío ── */}
      {carritoVacio ? (
        <div className="text-center text-muted py-5 d-flex flex-column align-items-center">
          <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-3" style={{width: '80px', height: '80px'}}>
            <i className="bi bi-cart-x text-secondary" style={{ fontSize: "2.5rem" }} />
          </div>
          <p className="fs-5 fw-medium mb-1">Tu cesta está vacía</p>
          <p className="small">¡Añade algunos productos para empezar!</p>
        </div>
      ) : (
        <div className="d-flex flex-column">
          {/* ── Lista de items ── */}
          <div className="mb-4 d-flex flex-column gap-3">
            {items.map(({ producto, cantidad }) => (
              <div
                key={producto.id}
                className="carrito-item-row p-3 border bg-white"
              >
                <div className="d-flex align-items-start gap-3">
                  {/* Miniatura fija a la izquierda */}
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.descripcion}
                      className="carrito-miniatura flex-shrink-0"
                    />
                  ) : (
                    <div className="carrito-miniatura flex-shrink-0 d-flex justify-content-center align-items-center bg-secondary bg-opacity-10 border text-muted">
                      <i className="bi bi-image" style={{ fontSize: '1.2rem', opacity: 0.5 }}></i>
                    </div>
                  )}

                  {/* Columna derecha con Textos arriba y Controles abajo (a prueba de desbordes) */}
                  <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
                    
                    {/* Textos: Nombre truncado seguro gracias al minWidth: 0 */}
                    <p className="mb-0 fw-bold text-truncate" title={producto.descripcion}>
                      {producto.descripcion}
                    </p>
                    <p className="mb-2 text-muted small fw-medium">
                      {producto.precio.toFixed(2)} € × {cantidad}
                    </p>

                    {/* Fila del precio total e incrementadores envueltos horizontalmente */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mt-auto gap-2">
                       <span className="fw-bolder text-primary">
                         {(producto.precio * cantidad).toFixed(2)} €
                       </span>

                       {/* Bloque de botones protegidos contra encogimiento con flex-shrink-0 */}
                       <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-10 p-1 rounded-pill flex-shrink-0">
                         <button
                           className="btn btn-sm btn-xs border-0 rounded-circle d-flex align-items-center justify-content-center bg-body shadow-sm text-danger"
                           onClick={() => onDecrementar(producto.id)}
                           title="Quitar uno"
                           style={{ width: "26px", height: "26px" }}
                         >
                           <i className="bi bi-dash-lg fw-bold" />
                         </button>
                         <span className="fw-bold small d-inline-block text-center" style={{minWidth: '20px'}}>
                           {cantidad}
                         </span>
                         <button
                           className="btn btn-sm btn-xs border-0 rounded-circle d-flex align-items-center justify-content-center bg-body shadow-sm text-primary"
                           onClick={() => onIncrementar(producto.id)}
                           title="Añadir uno más"
                           disabled={producto.stock <= 0}
                           style={{ width: "26px", height: "26px" }}
                         >
                           <i className="bi bi-plus-lg fw-bold" />
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Total ── */}
          <div className="bg-light p-3 rounded-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-medium">Subtotal</span>
              <span className="fw-semibold">{total.toFixed(2)} €</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-medium">Envío</span>
              <span className="fw-semibold text-success">Gratis</span>
            </div>
            <hr className="my-2 opacity-10" />
            <div className="d-flex justify-content-between align-items-center mt-2">
               <span className="fw-bold fs-5">Total</span>
               <span className="fs-4 fw-bolder text-primary">{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* ── Botón pedido ── */}
          <button
            className="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3 d-flex justify-content-center align-items-center gap-2 shadow-sm"
            onClick={onRealizarPedido}
          >
            <i className="bi bi-bag-check-fill" />
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
