/**
 * CategoriaAcordeon.jsx
 
  Este componente del catálogo recibe la categoría, los productos que la contienen y la función
  onAgregarAlCarrito. Lo que hace exactamente es:
  
  - Crear un estado de abierto o cerrado para que, al hacer clic, se le dé la vuelta al icono de
    la flecha y a su vez cambie la visibilidad del contenido.
  - Calcular la variable conStock, que filtra y cuenta cuántos productos de esa sección tienen
    unidades disponibles (> 0).
  - Mostrar en la cabecera el nombre de la categoría junto a un marcador visual (conStock /
    total de productos), informando de la disponibilidad de un vistazo.
  - Mostrar justo debajo la cuadrícula con sus productos correspondientes, dibujando un
    componente ProductoCard por cada artículo cuando el menú está desplegado.

 */

import React, { useState } from "react";
import ProductoCard from "./ProductoCard";

export default function CategoriaAcordeon({ categoria, productos, onAgregarAlCarrito }) {
  const [abierta, setAbierta] = useState(true);

  const conStock = productos.filter((p) => p.stock > 0).length;

  return (
    <div className="mb-4">
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

      <div className={`categoria-contenido ${abierta ? "" : "oculto"}`}>
        <div>
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
