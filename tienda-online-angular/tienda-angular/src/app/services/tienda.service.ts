import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';

// Este archivo será el puente de conexión entre nuestra aplicación Angular y el Backend
// Injecta el servicio para que este disponible para toda la aplicacion

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  // HttpClient es un servicio de Angular que se usa para hacer peticiones HTTP
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Estado global reactivo de los productos
  productos = signal<Producto[]>([]);

  // Este método devuelve un array de productos
  getProductosYCategorias(): Observable<Producto[]> {
    return forkJoin({
      productos: this.http.get<any[]>(`${this.baseUrl}/productos`),
      categorias: this.http.get<Categoria[]>(`${this.baseUrl}/categorias`)
    }).pipe(
      map(({ productos, categorias }) => {
        return productos.map(p => {
          const cat = categorias.find(c => c.id === p.categoria_id);
          const imagesArr = Array.isArray(p.imagenes) ? p.imagenes : [];
          // Esta línea construye las URLs completas de las imágenes
          const fullUrls = imagesArr.filter(Boolean).map((ruta: string) => `http://localhost:3000/uploads/${ruta}`);

          return {
            id: p.id,
            codigo: p.codigo_unico,
            descripcion: p.nombre,
            precio: parseFloat(p.precio),
            stock: p.stock,
            categoria: cat ? cat.nombre : 'Desconocida',
            imagenes: fullUrls
          };
        });
      })
    );
  }

  // Recarga el catálogo y repinta la UI reactivamente
  cargarCatalogo() {
    this.getProductosYCategorias().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  // Obtener categorías desde el backend
  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  // Agregar una nueva categoría a la base de datos
  agregarCategoria(nombre: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias`, { nombre });
  }

  // Agregar un nuevo producto (usa FormData para soportar la subida física de imágenes)
  agregarProducto(form: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/productos`, form);
  }

  // Editar un producto existente (usa FormData para las imágenes nuevas si aplica)
  editarProducto(id: number, form: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/productos/${id}`, form);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}`);
  }

  // Actualiza el stock de un producto específico y repinta la UI reactivamente
  actualizarStock(productoId: number, delta: number) {
    this.productos.update(prods =>
      prods.map(p =>
        p.id === productoId ? { ...p, stock: p.stock + delta } : p
      )
    );
  }
}
