/**
 * Componente Principal (App Root)
 * * Este archivo actúa como el contenedor maestro y el punto de anclaje inicial 
 * de toda la aplicación Angular.
 * 1. Declara sus propias herramientas y los 
 * componentes hijos que va a usar en pantalla (Catálogo y Carrito).
 * 2. Emplea un `signal` para almacenar la lista de 
 * productos. Esta estructura actúa como una variable inteligente que avisa 
 * automáticamente al HTML para que se repinte cuando entran datos nuevos.
 * 3. Inicialización (ngOnInit): Es el primer código en ejecutarse tras cargar 
 * el componente. Utiliza el servicio inyectado (`TiendaService`) para 
 * descargar los productos del backend, se suscribe a la respuesta y guarda 
 * la información en el `signal` mediante el método `.set()`.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaService } from './services/tienda.service';
import { Producto } from './models/producto.model';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CatalogoComponent, CarritoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private tiendaService = inject(TiendaService);

  //signal se usan para que el componente se actualice automaticamente cuando los datos cambian
  //es un mecanismo de reactividad
  productos = signal<Producto[]>([]);

  //esta funcion inserta los productos en el signal cuando se carga la aplicacion
  ngOnInit() {
    this.tiendaService.getProductosYCategorias().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }
}
