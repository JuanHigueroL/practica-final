import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Comprobamos si existe en localStorage y devolvemos true o false
  temaOscuro = signal<boolean>(localStorage.getItem('temaOscuro') === 'true');

  constructor() {
    // Sincronizar el Tema con el DOM de forma reactiva cada vez que cambia el signal
    effect(() => {
      const oscuro = this.temaOscuro();
      document.documentElement.setAttribute('data-bs-theme', oscuro ? 'dark' : 'light');
      localStorage.setItem('temaOscuro', String(oscuro));
    });
  }

  toggleTema() {
    this.temaOscuro.update(prev => !prev);
  }
}
