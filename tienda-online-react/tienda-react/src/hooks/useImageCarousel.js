/**
 * useImageCarousel.js
 * Hook personalizado que gestiona el carrusel automático de imágenes al hover.
 *
 * Retorna:
 *   - imagenActual: índice de la imagen a mostrar
 *   - manejadores: { onMouseEnter, onMouseLeave } para aplicar al contenedor
 */

import { useState, useRef, useEffect, useCallback } from "react";

const INTERVALO_MS = 1500; // Tiempo entre cambios de imagen

export function useImageCarousel(totalImagenes) {
  const [imagenActual, setImagenActual] = useState(0);
  // useRef para guardar el ID del intervalo sin provocar re-renders
  const intervaloRef = useRef(null);

  // Limpiamos el intervalo si el componente se desmonta con el cursor encima
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  const iniciarCarrusel = useCallback(() => {
    // Evitamos crear intervalos duplicados
    if (intervaloRef.current) return;

    intervaloRef.current = setInterval(() => {
      setImagenActual((prev) => (prev + 1) % totalImagenes);
    }, INTERVALO_MS);
  }, [totalImagenes]);

  const detenerCarrusel = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    // Volvemos a la imagen principal al retirar el cursor
    setImagenActual(0);
  }, []);

  return {
    imagenActual,
    manejadores: {
      onMouseEnter: iniciarCarrusel,
      onMouseLeave: detenerCarrusel,
    },
  };
}
