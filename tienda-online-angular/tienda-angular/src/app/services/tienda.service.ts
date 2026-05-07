/**
 * TiendaService
 * * Este servicio actúa como el "motor de datos" o intermediario exclusivo entre 
 * la aplicación Angular y el servidor backend (Node.js).
 * * ¿Qué hace exactamente getProductosYCategorias()?
 * 1. Petición simultánea: Descarga a la vez (forkJoin) el listado crudo de 
 * productos y el de categorías.
 * 2. Cruce de datos: Usa la lista de categorías como diccionario para traducir 
 * el 'categoria_id' del producto a su nombre real en texto.
 * 3. Formateo de imágenes: Añade la ruta base del servidor a los nombres de 
 * los archivos para construir URLs absolutas legibles por el navegador.
 * 4. Tipado seguro: Transforma el precio a un número decimal (float) y adapta 
 * los nombres de las variables al modelo estricto de Angular (Producto).
 * returns {Observable<Producto[]>} Un flujo de datos que contiene el catálogo 
 * de productos final, limpio y listo para ser renderizado en la interfaz.
 */


import { Injectable, inject } from '@angular/core';
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
}
