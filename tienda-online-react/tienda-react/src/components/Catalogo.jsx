/**
 * Catalogo.jsx
  El componente Catalogo actúa como el escaparate organizador de la tienda. Recibe la lista 
  completa de productos y la función onAgregarAlCarrito. 
  Lo que hace exactamente es:
  
  - Mantener un estado de memoria (terminoBusqueda) para guardar lo que el usuario teclea en el 
    buscador.
  - Capturar ese texto en tiempo real, aplicando una transición visual fluida 
    (startViewTransition) al filtrar si el navegador es compatible.
  - Filtrar el catálogo utilizando useMemo para no sobrecargar el procesador, dejando únicamente 
    los artículos que coinciden con la búsqueda (ignorando mayúsculas y espacios).
  - Agrupar los productos sobrevivientes separándolos por familias mediante la herramienta reduce 
    y useMemo, construyendo un objeto organizado por categorías.
  - Extraer los nombres de ese objeto mediante Object.keys() para obtener un listado cuadrado de 
    etiquetas.
  - Finalmente, renderizar la barra de búsqueda y utilizar un bucle .map() para dibujar en pantalla 
    un componente CategoriaAcordeon por cada etiqueta, entregándole sus productos 
    correspondientes.
 */

import React, { useState, useMemo } from "react";
import CategoriaAcordeon from "./CategoriaAcordeon";

export default function Catalogo({ productos, onAgregarAlCarrito }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Recoge el valor del input y se lo asigna a terminoBusqueda
  // Usamos startViewTransition para que el navegador desvanezca
  // progresivamente los elementos individuales antes de sacarlos del DOM
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTerminoBusqueda(valor);
      });
    } else {
      setTerminoBusqueda(valor);
    }
  };

  // Filtra los productos según el termino de búsqueda
  // Se usa useMemo para que no se ejecute cada vez que se escriba el mismo input
  // Si el término de búsqueda coincide con la descripción o el código del producto, se muestra
  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda) return productos;
    const query = terminoBusqueda.toLowerCase().trim();
    return productos.filter((producto) =>
      (producto.descripcion && producto.descripcion.toLowerCase().includes(query)) ||
      (producto.codigo && producto.codigo.toLowerCase().includes(query))
    );
  }, [productos, terminoBusqueda]);


  // Agrupa los productos filtrados por categoría
  const porCategoria = useMemo(() => {
    return productosFiltrados.reduce((grupos, producto) => {
      const cat = producto.categoria;
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(producto);
      return grupos;
    }, {});
  }, [productosFiltrados]);

  // Guarda todas las categorias existentes
  const categorias = Object.keys(porCategoria);

  // Devuelve el layout del catálogo
  return (
    <div style={{ viewTransitionName: "catalogo-layout" }}>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.35s;
        }
        .fade-enter {
          animation: fadeSlideUp 0.3s ease-out forwards;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mb-4 d-flex align-items-center gap-3 pb-3 border-bottom border-light" style={{ borderBottomColor: 'rgba(0,0,0,0.05)' }}>
        <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
          <i className="bi bi-grid-fill fs-4 text-primary d-block" style={{ lineHeight: 1 }} />
        </div>
        <h4 className="fw-bolder mb-0 fs-3">Descubre Productos</h4>
      </div>

      <div className="mb-5 position-relative">
        <i className="bi bi-search position-absolute text-muted fs-5" style={{ top: '50%', left: '20px', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-control form-control-lg bg-light border-0 shadow-sm"
          placeholder="Buscar productos (ej. Auriculares, PC-12...)"
          value={terminoBusqueda}
          onChange={handleBusquedaChange}
          style={{ paddingLeft: '55px', borderRadius: '1rem', transition: 'all 0.3s', outline: 'none' }}
        />
      </div>

      {categorias.length === 0 ? (
        <div className="alert alert-info border-0 shadow-sm text-center py-5 fade-enter" style={{ borderRadius: '1.5rem' }}>
          <i className="bi bi-emoji-frown text-info fs-1 mb-3 d-block" />
          <h5 className="fw-bold">No quedan productos</h5>
          <p className="text-muted mb-0">Prueba borrando parte del nombre buscado.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {/* Renderiza un componente CategoriaAcordeon por cada categoría */}
          {categorias.map((cat) => (
            <div key={cat} className="fade-enter">
              <CategoriaAcordeon
                categoria={cat}
                productos={porCategoria[cat]}
                onAgregarAlCarrito={onAgregarAlCarrito}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
