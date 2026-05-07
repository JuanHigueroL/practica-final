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
