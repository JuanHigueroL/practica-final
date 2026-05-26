import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaService } from './services/tienda.service';
import { CarritoService } from './services/carrito.service';
import { ThemeService } from './services/theme.service';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CatalogoComponent, CarritoComponent, AdminPanelComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private tiendaService = inject(TiendaService);
  carritoService = inject(CarritoService);
  themeService = inject(ThemeService);

  // Leemos el signal centralizado del servicio
  productos = this.tiendaService.productos;

  // Estado reactivo para la vista ('tienda' o 'admin')
  vista = signal<'tienda' | 'admin'>('tienda');

  //esta funcion inserta los productos en el signal cuando se carga la aplicacion
  ngOnInit() {
    this.tiendaService.cargarCatalogo();
  }

  // Permite acceder al panel de administrador mediante un window.prompt
  manejarAccesoAdmin() {
    const clave = window.prompt("Introduce la clave de acceso de administrador:");
    if (clave === "123456") {
      this.vista.set("admin");
    } else if (clave !== null && clave !== "") {
      alert("Acceso denegado. Contraseña incorrecta.");
    }
  }
}
