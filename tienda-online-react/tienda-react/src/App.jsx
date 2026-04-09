/**
 * App.jsx
 * Componente raíz. Centraliza:
 *   - Estado de productos (con stock reactivo)
 *   - Estado del carrito
 *   - Todas las funciones que lo modifican
 *
 * Para conectar con el backend real, sustituye la inicialización de `productos`
 * por un useEffect con fetch/axios:
 *
 *   useEffect(() => {
 *     fetch("/api/productos")
 *       .then(r => r.json())
 *       .then(data => setProductos(data));
 *   }, []);
 */

import React, { useState } from "react";
import Catalogo from "./components/Catalogo";
import Carrito from "./components/Carrito";
import { PRODUCTOS_INICIALES } from "./data/productos";
import "./App.css";

export default function App() {
  // ── Estado principal ────────────────────────────────────────────
  // Copia del catálogo con stock mutable (se reduce al añadir, aumenta al quitar)
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);

  // Carrito: array de { producto: {...}, cantidad: number }
  const [carrito, setCarrito] = useState([]);

  // ── Helpers internos ────────────────────────────────────────────

  /** Modifica el stock de un producto por su id (delta puede ser +1 o -1) */
  const actualizarStock = (productoId, delta) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoId ? { ...p, stock: p.stock + delta } : p
      )
    );
  };

  // ── Acciones del carrito ─────────────────────────────────────────

  /**
   * Agregar al carrito:
   * - Descuenta 1 unidad del stock en el catálogo.
   * - Si el producto ya estaba en el carrito, incrementa su cantidad.
   * - Si no, crea una nueva entrada con cantidad 1.
   */
  const agregarAlCarrito = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || producto.stock <= 0) return;

    // Reducimos stock en catálogo
    actualizarStock(productoId, -1);

    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === productoId);
      if (existente) {
        // Ya estaba: sólo aumentamos cantidad
        return prev.map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Nuevo item en el carrito (guardamos snapshot del producto)
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  /**
   * Incrementar desde el carrito (+1):
   * Equivale a agregar una unidad más del mismo producto.
   */
  const incrementarEnCarrito = (productoId) => {
    agregarAlCarrito(productoId);
  };

  /**
   * Decrementar desde el carrito (-1):
   * - Devuelve 1 unidad al stock del catálogo.
   * - Si la cantidad llega a 0, elimina el item del carrito.
   */
  const decrementarEnCarrito = (productoId) => {
    actualizarStock(productoId, +1);

    setCarrito((prev) => {
      const item = prev.find((i) => i.producto.id === productoId);
      if (!item) return prev;

      if (item.cantidad === 1) {
        // Quitamos el item completamente
        return prev.filter((i) => i.producto.id !== productoId);
      }
      // Restamos una unidad
      return prev.map((i) =>
        i.producto.id === productoId
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      );
    });
  };

  /**
   * Realizar pedido:
   * En producción haríamos un POST al backend.
   * Por ahora mostramos un alert y limpiamos el estado.
   */
  const realizarPedido = () => {
    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    const total = carrito
      .reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
      .toFixed(2);

    // ── Aquí iría el POST al backend: ──
    // await axios.post("/api/pedidos", { items: carrito });

    alert(
      `✅ ¡Pedido realizado con éxito!\n\n` +
        `Productos: ${totalItems}\n` +
        `Total: ${total} €\n\n` +
        `Recibirás un email de confirmación.`
    );

    // Restauramos el stock de los productos del carrito
    setProductos((prevProductos) =>
      prevProductos.map((p) => {
        const itemEnCarrito = carrito.find((i) => i.producto.id === p.id);
        if (itemEnCarrito) {
          return { ...p, stock: p.stock + itemEnCarrito.cantidad };
        }
        return p;
      })
    );

    setCarrito([]);
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary mb-4 shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-4">
            <i className="bi bi-shop me-2" />
            TiendaApp
          </span>
          <span className="text-white">
            <i className="bi bi-cart3 me-1" />
            {carrito.reduce((acc, i) => acc + i.cantidad, 0)} artículos
          </span>
        </div>
      </nav>

      {/* Layout principal: Bootstrap grid */}
      <div className="container-fluid px-4">
        <div className="row g-4">
          {/* ── Catálogo (8 columnas) ── */}
          <div className="col-md-8">
            <Catalogo
              productos={productos}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          </div>

          {/* ── Carrito (4 columnas) ── */}
          <div className="col-md-4">
            <Carrito
              items={carrito}
              onIncrementar={incrementarEnCarrito}
              onDecrementar={decrementarEnCarrito}
              onRealizarPedido={realizarPedido}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
