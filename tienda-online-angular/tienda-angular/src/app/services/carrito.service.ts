import { Injectable, signal, computed, inject } from '@angular/core';
import { CarritoItem } from '../models/carrito-item.model';
import { TiendaService } from './tienda.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private tiendaService = inject(TiendaService);
  
  carrito = signal<CarritoItem[]>([]);

  cantidadItems = computed(() => 
    this.carrito().reduce((acc, item) => acc + item.cantidad, 0)
  );
  
  total = computed(() => 
    this.carrito().reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)
  );

  agregarAlCarrito(productoId: number) {
    const productos = this.tiendaService.productos();
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto || producto.stock <= 0) return;

    this.tiendaService.actualizarStock(productoId, -1);

    this.carrito.update(items => {
      const existente = items.find(i => i.producto.id === productoId);
      if (existente) {
        return items.map(i => 
          i.producto.id === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }

  decrementarEnCarrito(productoId: number) {
    this.tiendaService.actualizarStock(productoId, +1);

    this.carrito.update(items => {
      const item = items.find(i => i.producto.id === productoId);
      if (!item) return items;
      if (item.cantidad === 1) {
        return items.filter(i => i.producto.id !== productoId);
      }
      return items.map(i => 
        i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
      );
    });
  }

  realizarPedido() {
    const items = this.cantidadItems();
    const tot = this.total().toFixed(2);
    alert(`✅ ¡Pedido realizado con éxito!\nProductos: ${items}\nTotal: ${tot} €\nRecibirás un email de confirmación.`);
    this.carrito.set([]);
  }
}
