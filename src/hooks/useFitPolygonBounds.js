// hooks/useFitPolygonBounds.js or .ts
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function useFitPolygonBounds(positions) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) return;

    map.fitBounds(positions);
  }, [map, positions]);
}
