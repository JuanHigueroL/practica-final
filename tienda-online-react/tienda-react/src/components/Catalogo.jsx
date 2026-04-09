/**
 * Catalogo.jsx
 * Recibe la lista de productos (con stock ya reactivo) y los agrupa por categoría.
 * Renderiza un <CategoriaAcordeon> por cada categoría encontrada.
 */

import React, { useMemo } from "react";
import CategoriaAcordeon from "./CategoriaAcordeon";

export default function Catalogo({ productos, onAgregarAlCarrito }) {
  /**
   * Agrupamos los productos por su campo 'categoria'.
   * useMemo evita recalcular en cada render si la lista no cambió.
   * Resultado: { "Electrónica": [...], "Ropa": [...], ... }
   */
  const porCategoria = useMemo(() => {
    return productos.reduce((grupos, producto) => {
      const cat = producto.categoria;
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(producto);
      return grupos;
    }, {});
  }, [productos]);

  const categorias = Object.keys(porCategoria);

  if (categorias.length === 0) {
    return (
      <div className="alert alert-info">No hay productos disponibles.</div>
    );
  }

  return (
    <div>
      <h4 className="mb-3 border-bottom pb-2">
        <i className="bi bi-grid-3x3-gap-fill me-2 text-primary" />
        Catálogo
      </h4>

      {categorias.map((cat) => (
        <CategoriaAcordeon
          key={cat}
          categoria={cat}
          productos={porCategoria[cat]}
          onAgregarAlCarrito={onAgregarAlCarrito}
        />
      ))}
    </div>
  );
}
