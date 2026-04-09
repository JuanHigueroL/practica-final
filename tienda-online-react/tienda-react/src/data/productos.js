/**
 * productos.js
 * Datos simulados del catálogo.
 * Para conectar con el backend real, reemplaza este array por una llamada
 * fetch/axios en un useEffect dentro de App.jsx y guarda la respuesta en el estado.
 *
 * Estructura esperada de la API:
 *   GET /api/productos  →  misma forma que este array
 */

export const PRODUCTOS_INICIALES = [
  // ── Electrónica ────────────────────────────────────────────────
  {
    id: 1,
    categoria: "Electrónica",
    codigo: "ELEC-001",
    descripcion: "Auriculares Bluetooth Pro",
    precio: 59.99,
    stock: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80",
    ],
  },
  {
    id: 2,
    categoria: "Electrónica",
    codigo: "ELEC-002",
    descripcion: "Smartwatch Serie X",
    precio: 129.99,
    stock: 5,
    imagenes: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80",
    ],
  },
  {
    id: 3,
    categoria: "Electrónica",
    codigo: "ELEC-003",
    descripcion: "Teclado Mecánico RGB",
    precio: 89.95,
    stock: 2,
    imagenes: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&q=80",
    ],
  },
  // ── Ropa ───────────────────────────────────────────────────────
  {
    id: 4,
    categoria: "Ropa",
    codigo: "ROPA-001",
    descripcion: "Camiseta Algodón Premium",
    precio: 24.99,
    stock: 10,
    imagenes: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80",
    ],
  },
  {
    id: 5,
    categoria: "Ropa",
    codigo: "ROPA-002",
    descripcion: "Sudadera Oversize Unisex",
    precio: 44.50,
    stock: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=300&q=80",
    ],
  },
  {
    id: 6,
    categoria: "Ropa",
    codigo: "ROPA-003",
    descripcion: "Zapatillas Running Air",
    precio: 79.99,
    stock: 6,
    imagenes: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&q=80",
    ],
  },
  // ── Hogar ──────────────────────────────────────────────────────
  {
    id: 7,
    categoria: "Hogar",
    codigo: "HOG-001",
    descripcion: "Lámpara de Escritorio LED",
    precio: 34.99,
    stock: 8,
    imagenes: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
    ],
  },
  {
    id: 8,
    categoria: "Hogar",
    codigo: "HOG-002",
    descripcion: "Cafetera de Goteo Automática",
    precio: 49.95,
    stock: 1,
    imagenes: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80",
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=300&q=80",
    ],
  },
];
