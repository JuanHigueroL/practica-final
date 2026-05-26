import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { CategoriaAcordeonComponent } from '../categoria-acordeon/categoria-acordeon.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriaAcordeonComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  productos = input<Producto[]>([]);

  terminoBusqueda = signal('');

  // Esta funcion filtra los productos basandose en el termino de busqueda. 
  productosFiltrados = computed(() => {
    const term = this.terminoBusqueda().toLowerCase().trim();
    const prods = this.productos();
    if (!term) return prods;

    return prods.filter((producto) =>
      (producto.descripcion && producto.descripcion.toLowerCase().includes(term)) ||
      (producto.codigo && producto.codigo.toLowerCase().includes(term))
    );
  });

  porCategoria = computed(() => {
    return this.productosFiltrados().reduce((grupos: any, producto) => {
      const cat = producto.categoria;
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(producto);
      return grupos;
    }, {});
  });

  categorias = computed(() => Object.keys(this.porCategoria()));

  handleBusquedaChange(event: any) {
    const valor = event.target.value;
    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        this.terminoBusqueda.set(valor);
      });
    } else {
      this.terminoBusqueda.set(valor);
    }
  }
}
