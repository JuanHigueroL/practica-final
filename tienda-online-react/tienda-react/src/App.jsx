/**
 * App.jsx
 * Componente raíz. Centraliza:
 *   - Estado de productos (con stock reactivo)
 *   - Estado de categorías
 *   - Estado del carrito
 *   - Estado de la vista (tienda o admin)
 */

import React, { useState, useEffect } from "react";
import Catalogo from "./components/Catalogo";
import Carrito from "./components/Carrito";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

export default function App() {
  // ── Estados Principales ──────────────────────────────────────────
  const [vista, setVista] = useState("tienda"); // 'tienda' | 'admin'
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [temaOscuro, setTemaOscuro] = useState(() => {
    const temaGuardado = localStorage.getItem('temaOscuro');
    return temaGuardado === 'true';
  });

  // ── Sincronizar Tema con el DOM ──────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', temaOscuro ? 'dark' : 'light');
    localStorage.setItem('temaOscuro', temaOscuro);
  }, [temaOscuro]);

  // ── Llamadas API ────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const resCat = await fetch("http://localhost:3000/api/categorias");
      const cats = await resCat.json();
      setCategorias(cats); 
      
      const resProd = await fetch("http://localhost:3000/api/productos");
      const prods = await resProd.json();
      
      const productosMapeados = prods.map(p => {
        const cat = cats.find(c => c.id === p.categoria_id);
        const imagesArr = Array.isArray(p.imagenes) ? p.imagenes : [];
        const fullUrls = imagesArr.filter(Boolean).map(ruta => `http://localhost:3000/uploads/${ruta}`);
        
        return {
          id: p.id,
          codigo: p.codigo_unico,
          descripcion: p.nombre, 
          precio: parseFloat(p.precio),
          stock: p.stock,
          categoria: cat ? cat.nombre : "Desconocida", 
          imagenes: fullUrls
        };
      });
      setProductos(productosMapeados);
    } catch (err) {
      // Error silencioso
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Helpers de Admin ────────────────────────────────────────────
  const manejarAccesoAdmin = () => {
    const clave = window.prompt("Introduce la clave de acceso de administrador:");
    if (clave === "123456") {
      setVista("admin");
    } else if (clave !== null && clave !== "") {
      alert("Acceso denegado. Contraseña incorrecta.");
    }
  };

  const agregarProducto = () => {
    fetchData(); 
  };

  const agregarCategoria = () => {
    fetchData(); 
  };

  // ── Acciones comunes y Carrito ──────────────────────────────────
  const actualizarStock = (productoId, delta) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoId ? { ...p, stock: p.stock + delta } : p
      )
    );
  };

  const agregarAlCarrito = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || producto.stock <= 0) return;

    actualizarStock(productoId, -1);
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === productoId);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const decrementarEnCarrito = (productoId) => {
    actualizarStock(productoId, +1);
    setCarrito((prev) => {
      const item = prev.find((i) => i.producto.id === productoId);
      if (!item) return prev;
      if (item.cantidad === 1) {
        return prev.filter((i) => i.producto.id !== productoId);
      }
      return prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
      );
    });
  };

  const realizarPedido = () => {
    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    const total = carrito.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0).toFixed(2);
    alert(`✅ ¡Pedido realizado con éxito!\nProductos: ${totalItems}\nTotal: ${total} €\nRecibirás un email de confirmación.`);
    
    // Al realizar pedido, vaciamos el carrito permanentemente.
    // (El stock en catálogo ya fue mermado cada vez que agregamos al carrito).
    setCarrito([]);
  };

  // ── Renderización Condicional (Router Manual) ───────────────────
  if (vista === "admin") {
    return (
      <AdminPanel 
        categorias={categorias}
        onAgregarCategoria={agregarCategoria}
        onAgregarProducto={agregarProducto}
        onVolver={() => setVista("tienda")}
      />
    );
  }

  // ── Renderización Tienda ────────────────────────────────────────
  const cantidadCarrito = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="app-wrapper pb-5">
      {/* Premium Header */}
      <nav className="premium-header mb-4">
        <div className="container-fluid px-2 px-md-5 d-flex justify-content-between align-items-center flex-wrap gap-2">
          
          <span className="navbar-brand fs-4 fs-md-3 brand-title d-flex align-items-center gap-2 m-0 flex-shrink-0">
            <i className="bi bi-box-seam text-primary" />
            <span>Tienda App</span>
          </span>
          
          <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
            <button 
              onClick={() => setTemaOscuro(!temaOscuro)}
              className={`btn rounded-circle shadow-sm border p-0 d-flex align-items-center justify-content-center theme-toggle flex-shrink-0 ${temaOscuro ? 'btn-dark border-secondary' : 'btn-light'}`}
              style={{ width: '38px', height: '38px' }}
              title={temaOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              <i className={`fs-5 bi ${temaOscuro ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-secondary'}`} />
            </button>
            <button 
              className={`btn fw-bold shadow-sm flex-shrink-0 ${temaOscuro ? 'btn-outline-light' : 'btn-outline-primary bg-white'}`} 
              onClick={manejarAccesoAdmin}>
              <i className="bi bi-person-badge-fill me-1" /> 
              <span className="d-none d-sm-inline">Panel Admin</span>
              <span className="d-inline d-sm-none small">Admin</span>
            </button>
            
            <div 
              className={`cart-pill d-flex align-items-center gap-1 gap-md-2 flex-shrink-0 px-2 px-md-3 ${temaOscuro ? 'bg-dark border-secondary text-light' : 'bg-white'}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                const el = document.getElementById("seccion-carrito");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              title="Ir a mi cesta"
            >
              <i className="bi bi-cart3 text-primary fs-5" />
              <span className="small fw-bold">
                {cantidadCarrito} <span className="d-none d-md-inline fw-normal">artículos</span>
              </span>
            </div>
          </div>
          
        </div>
      </nav>

      {/* Layout principal */}
      <div className="container-fluid px-4 px-md-5">
        <div className="row g-5">
          <div className="col-lg-8 col-xl-9">
            <Catalogo 
              productos={productos} 
              onAgregarAlCarrito={agregarAlCarrito} 
            />
          </div>
          <div className="col-lg-4 col-xl-3" id="seccion-carrito">
            <Carrito 
              items={carrito} 
              onIncrementar={agregarAlCarrito} 
              onDecrementar={decrementarEnCarrito} 
              onRealizarPedido={realizarPedido} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
