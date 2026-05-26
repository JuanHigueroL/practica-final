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
