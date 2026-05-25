/**
 * ProductoCardComponent
 * * Componente "hoja" (el eslabón final) que dibuja la tarjeta visual de un artículo individual.
 * * 1. Entrada Estricta: Exige de forma obligatoria (`input.required`) recibir los datos de un único producto para poder existir.
 * * 2. Control de Disponibilidad: Evalúa matemáticamente el inventario (`sinStock`) para saber si el artículo está agotado.
 * * 3. Interacción (Fase 1): Prepara el disparador del botón de compra (`agregarAlCarrito`), el cual temporalmente solo registra la acción en la consola.
 */

import { Component, input, computed, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.css']
})
export class ProductoCardComponent implements OnDestroy {
  private carritoService = inject(CarritoService);
  
  producto = input.required<Producto>();

  sinStock = computed(() => this.producto().stock <= 0);

  imagenActual = signal(0);
  private intervaloId: any = null;

  iniciarCarrusel() {
    const total = this.producto().imagenes?.length || 0;
    if (total <= 1 || this.intervaloId) return;

    this.intervaloId = setInterval(() => {
      this.imagenActual.update(prev => (prev + 1) % total);
    }, 1500);
  }

  detenerCarrusel() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
    this.imagenActual.set(0);
  }

  agregarAlCarrito() {
    this.carritoService.agregarAlCarrito(this.producto().id);
  }

  ngOnDestroy() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }
}
