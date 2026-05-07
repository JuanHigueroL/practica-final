/**
 * CategoriaAcordeonComponent
 * * Componente intermedio que actúa como contenedor desplegable (acordeón) para cada familia de productos.
 * * 1. Recepción Aislada: Recibe a través de `input()` únicamente el nombre de la categoría y la lista de artículos que pertenecen exclusivamente a dicha familia.
 * * 2. Estado del Interruptor: Gestiona un `signal` booleano (`abierta`) que sirve para alternar la visibilidad del contenido al hacer clic, expandiendo o contrayendo el cajón.
 * * 3. Contador de Inventario: Utiliza un `computed` (`conStock`) para filtrar y contar automáticamente cuántos de esos productos tienen unidades disponibles (> 0), manteniendo la etiqueta de disponibilidad siempre actualizada.
 */

import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ProductoCardComponent } from '../producto-card/producto-card.component';

@Component({
  selector: 'app-categoria-acordeon',
  standalone: true,
  imports: [CommonModule, ProductoCardComponent],
  templateUrl: './categoria-acordeon.component.html',
  styleUrls: ['./categoria-acordeon.component.css']
})
export class CategoriaAcordeonComponent {
  categoria = input<string>('');
  productos = input<Producto[]>([]);

  abierta = signal(true);

  conStock = computed(() => this.productos().filter((p) => p.stock > 0).length);

  toggleAbierta() {
    this.abierta.update(v => !v);
  }
}
