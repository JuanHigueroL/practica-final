/**
 * ProductoCardComponent
 * * Componente "hoja" (el eslabón final) que dibuja la tarjeta visual de un artículo individual.
 * * 1. Entrada Estricta: Exige de forma obligatoria (`input.required`) recibir los datos de un único producto para poder existir.
 * * 2. Control de Disponibilidad: Evalúa matemáticamente el inventario (`sinStock`) para saber si el artículo está agotado.
 * * 3. Interacción (Fase 1): Prepara el disparador del botón de compra (`agregarAlCarrito`), el cual temporalmente solo registra la acción en la consola.
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.css']
})
export class ProductoCardComponent {
  producto = input.required<Producto>();

  sinStock = computed(() => this.producto().stock <= 0);

  agregarAlCarrito() {
    // Fase 1: Sin implementación lógica, se solicitó explícitamente en el prompt.
    console.log(`Intentando añadir al carrito: ${this.producto().id}`);
  }
}
