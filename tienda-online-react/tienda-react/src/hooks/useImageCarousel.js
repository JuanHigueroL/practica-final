/**
 * useImageCarousel.js
 * Recibe el total de imagenes que tiene el producto y devuelve el número de la imagen
 * que debe mostrar, cambiándola cada cierto tiempo y señalando que se realiza mediante los
 * eventos onMouseEnter y onMouseLeave para aplicar al contenedor.

 * Retorna:
 *   - imagenActual: índice de la imagen a mostrar
 *   - manejadores: { onMouseEnter, onMouseLeave } para aplicar al contenedor
 */

import { useState, useRef, useEffect, useCallback } from "react";

const INTERVALO_MS = 1500; // Tiempo entre cambios de imagen

//La función recibe totalImagenes que es el numero de imagenes que contiene el producto
export function useImageCarousel(totalImagenes) {
  //Se crea un estado para guardar la imagen actual
  const [imagenActual, setImagenActual] = useState(0);
  //Se usa para gaurdar el ID del intervalo 
  const intervaloRef = useRef(null);

  //Este efecto ocurre al arrancar la aplicación 
  useEffect(() => {
    return () => {
      // Si hay algún cronómetro guardado lo destruye
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  // hace uso de useCallback para optimizar el rendimiento
  const iniciarCarrusel = useCallback(() => {
    // Si ya existe un intervalo, no se inicia otro
    if (intervaloRef.current) return;

    // Crea un intervalo que cambia la imagen cada cierto
    intervaloRef.current = setInterval(() => {
      setImagenActual((prev) => (prev + 1) % totalImagenes);
    }, INTERVALO_MS);
  }, [totalImagenes]);

  // Detiene el carrusel, limpiando el intervalo y volviendo a la imagen principal
  const detenerCarrusel = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    // Volvemos a la imagen principal al retirar el cursor
    setImagenActual(0);
  }, []);

  // devuelve la imagen actual y los manejadores para aplicar al contenedor
  return {
    imagenActual,
    manejadores: {
      onMouseEnter: iniciarCarrusel,
      onMouseLeave: detenerCarrusel,
    },
  };
}
