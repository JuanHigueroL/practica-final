/**
 * App.jsx
 *
 * App.jsx lo que hace es crear el estado de vista, productos, categorías, carrito y temaOscuro. 
 * Luego crea los Effects que nada más iniciar lo que hacen es:
  
 * Cambiar el tema a oscuro o claro según la preferencia y lo guarda en LocalStorage 
    (se le llama cada vez que cambia temaOscuro).
 * Llamar a la API para guardar las categorías y los productos al iniciar, y se le llama de 
    nuevo cuando se guarda un nuevo producto o categoría.
 * Se maneja el acceso a la sección admin mediante un window.prompt.
 * Se crean acciones para cambiar el stock y guardarlo en el carrito al agregarlo o quitarlo, 
    y realizar la compra.
 * Por último, devuelve la vista del panel de Admin del componente AdminPanel devolviendo las 
    funciones y estados relacionados, o devuelve la vista de la tienda, creando el navegador y 
    usando los componentes de catálogo y carrito.
*/

import React, { useState, useEffect } from "react";
import Catalogo from "./components/Catalogo";
import Carrito from "./components/Carrito";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

export default function App() {
  // ── Estados Principales ──────────────────────────────────────────
  //Estos son los estados principales de la aplicación
  //Esta la vista que puede ser 'tienda' o 'admin'
  const [vista, setVista] = useState("tienda"); //Esta la vista que puede ser 'tienda' o 'admin'
  const [productos, setProductos] = useState([]); //Esta el listado de productos con array
  const [categorias, setCategorias] = useState([]); //Esta el listado de categorias
  const [carrito, setCarrito] = useState([]); //Esta el listado de productos en el carrito
  const [temaOscuro, setTemaOscuro] = useState(() => { // Y el temaOscuro que comprueba si existe en localStorage y devuelve true o false
    const temaGuardado = localStorage.getItem('temaOscuro');
    return temaGuardado === 'true';
  });

  // ── Sincronizar Tema con el DOM ──────────────────────────────────
  //Esta función se ejecuta cada vez que cambia el estado de temaOscuro
  // Cambia el atributo data-bs-theme y lo guarda o modifica en localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', temaOscuro ? 'dark' : 'light');
    localStorage.setItem('temaOscuro', temaOscuro);
  }, [temaOscuro]);

  // ── Llamadas API ────────────────────────────────────────────────
  //Esta funcion hace la peticion a la API para obtener las categorias y los productos
  const fetchData = async () => {
    try {
      // Se hace la peticion a la API para obtener las categorias
      const resCat = await fetch("http://localhost:3000/api/categorias");
      // Se convierte la respuesta en JSON
      const cats = await resCat.json();
      //Se actualiza el estado de categorías con las categorias obtenidas
      setCategorias(cats);

      //Se hace la petición a la API para obtener los productos
      const resProd = await fetch("http://localhost:3000/api/productos");
      //Se convierte la respuesta en JSON
      const prods = await resProd.json();

      // Recorre el array de productos
      const productosMapeados = prods.map(p => {
        // Busca la categoría correspondiente al producto
        const cat = cats.find(c => c.id === p.categoria_id);
        // Convierte las imágenes en un array
        const imagesArr = Array.isArray(p.imagenes) ? p.imagenes : [];
        // Convierte las imágenes en un array de URLs completas
        const fullUrls = imagesArr.filter(Boolean).map(ruta => `http://localhost:3000/uploads/${ruta}`);

        // Devuelve el producto con el formato correcto y el nombre de la categoría
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
      console.error("Error al obtener datos:", err);
    }
  };

  // Ejecuta la función fetchData cuando arranca la aplicación
  //Si se quita el corchete vacío se crea un bucle infinito
  //Esto provocaría que el servidor cayera
  //Un hacker podría aprovechar esto para tumbar el servidor
  // Una solución sería limitar el número de peticiones
  useEffect(() => {
    fetchData();
  }, []);

  // ── Helpers de Admin ────────────────────────────────────────────
  //Función que permite acceder al panel de administrador mediante un window.prompt
  //Si la clave es correcta se accede al panel de administrador
  //Si la clave es incorrecta se muestra un mensaje de error
  const manejarAccesoAdmin = () => {
    const clave = window.prompt("Introduce la clave de acceso de administrador:");
    if (clave === "123456") {
      setVista("admin");
    } else if (clave !== null && clave !== "") {
      alert("Acceso denegado. Contraseña incorrecta.");
    }
  };

  //Función que se ejecuta cuando se agrega un producto
  //Actualiza el listado de productos
  const agregarProducto = () => {
    fetchData();
  };

  //Función que se ejecuta cuando se agrega una categoría
  //Actualiza el listado de categorías
  const agregarCategoria = () => {
    fetchData();
  };

  // ── Acciones comunes y Carrito ──────────────────────────────────
  // Función para actualizar el stock de un producto
  // Comprueba el id del producto y cambia su stock o lo deja igual
  const actualizarStock = (productoId, delta) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoId ? { ...p, stock: p.stock + delta } : p
      )
    );
  };

  //Función para agregar un producto al carrito
  //Comprueba el id del producto y si no está en el carrito lo agrega
  const agregarAlCarrito = (productoId) => {
    // Comprueba si el producto existe y si tiene stock
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || producto.stock <= 0) return;

    // Actualiza el stock del producto
    actualizarStock(productoId, -1);

    // Si existe el producto en el carrito, suma 1 a la cantidad
    // Si no existe el producto en el carrito, agrega el producto al carrito
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
    // Suma 1 al stock del producto
    actualizarStock(productoId, +1);

    // Si no existe el producto en el carrito lo deja igual
    // Si existe el producto y tiene 1 de stock lo elimina del carrito
    // Si existe el producto y tiene más de 1 de stock resta 1 a la cantidad
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

  // Función para realizar el pedido
  // Calcula el total de productos y el precio y vacía el carrito
  const realizarPedido = () => {
    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    const total = carrito.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0).toFixed(2);
    alert(`✅ ¡Pedido realizado con éxito!\nProductos: ${totalItems}\nTotal: ${total} €\nRecibirás un email de confirmación.`);

    setCarrito([]);
  };

  // ── Renderización Condicional (Router Manual) ───────────────────
  // Se entregan las props correspondientes a cada vista
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