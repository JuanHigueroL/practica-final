// Este archivo define la estructura de un producto

export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenes: string[];
}
