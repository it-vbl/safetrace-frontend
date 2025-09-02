import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import * as turf from '@turf/turf';

export default function EnableRulerTool() {
  const map = useMap();

  useEffect(() => {
    let activeLayer = null;

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawPolygon: false,
      drawPolyline: true, // ruler mode
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    // Start drawing
    map.on('pm:drawstart', (e) => {
      activeLayer = e.workingLayer;

      activeLayer.on('pm:vertexadded', updateTooltip);
      map.on('mousemove', updateTooltip);
    });

    // When polyline drawing finished
    map.on('pm:create', (e) => {
      const layer = e.layer;

      // Attach click handler to show tooltip again
      layer.on('click', () => {
        const latlngs = layer.getLatLngs();
        if (latlngs.length < 2) return;

        const coords = latlngs.map((p) => [p.lng, p.lat]);
        const line = turf.lineString(coords);
        const total = turf.length(line, { units: 'kilometers' }).toFixed(2);

        layer.bindTooltip(`${total} km`, {
          permanent: false,
          sticky: true,
        });

        // Open at the middle of the line
        const midIndex = Math.floor(latlngs.length / 2);
        layer.openTooltip(latlngs[midIndex]);
      });
    });

    // Stop drawing
    map.on('pm:drawend', () => {
      if (activeLayer) {
        activeLayer.unbindTooltip();
        activeLayer = null;
      }
      map.off('mousemove', updateTooltip);
    });

    function updateTooltip(e) {
      if (!activeLayer) return;

      const latlngs = activeLayer.getLatLngs();
      if (latlngs.length < 1) return;

      let coords = latlngs.map((p) => [p.lng, p.lat]);

      if (e.latlng) {
        coords = [...coords, [e.latlng.lng, e.latlng.lat]];
      }

      if (coords.length < 2) return;

      const line = turf.lineString(coords);
      const total = turf.length(line, { units: 'kilometers' }).toFixed(2);

      activeLayer.bindTooltip(`${total} km`, {
        permanent: false,
        sticky: true,
      });

      const lastPoint = e.latlng || latlngs[latlngs.length - 1];
      activeLayer.openTooltip(lastPoint);
    }

    return () => {
      map.pm.removeControls();
      map.off('pm:drawstart');
      map.off('pm:drawend');
      map.off('pm:create');
      map.off('mousemove', updateTooltip);
    };
  }, [map]);

  return null;
}
