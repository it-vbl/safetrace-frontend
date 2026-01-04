'use client'; // if using App Router

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { GeoJSON, useMap } from 'react-leaflet';

import useStaticLayer from '@/hooks/useStaticLayer';
import { getPopupHtml } from '@/utils/popupUtils';

import { getColorOptions, registerPatterns } from './colorConfig';

import 'leaflet.pattern';

export default function IupMap() {
  const [polygons, setPolygons] = useState([]);
  const map = useMap();

  const { staticLayersDetail: data } = useStaticLayer();

  useEffect(() => {
    registerPatterns(map); // ✅ ensure patterns are added once
  }, [map]);

  useEffect(() => {
    if (typeof data !== 'object' || data == null) return;
    const tempArray = Object.values(data);
    setPolygons(tempArray);

    // Set view and fit bounds for the last static layer
    if (tempArray.length > 0) {
      const latestPolygon = tempArray[tempArray.length - 1];

      if (latestPolygon?.geom) {
        try {
          const layer = L.geoJSON(latestPolygon.geom);
          const bounds = layer.getBounds();

          // Get center coordinates
          const center = bounds.getCenter();

          // Set view to center
          map.setView([center.lat, center.lng], map.getZoom());

          // Fit bounds to the polygon
          map.fitBounds(bounds);
        } catch (error) {
          console.error('Error setting view and fitting bounds:', error);
        }
      }
    }
  }, [data, map]);

  return (
    <>
      {polygons.map((staticLayer, idx) => (
        <GeoJSON
          key={staticLayer?.id}
          data={staticLayer?.geom}
          // Remove style prop or use as fallback - styles will be set in onEachFeature
          style={() =>
            getColorOptions(staticLayer?.id, staticLayer?.properties)
              ?.pathOptions
          }
          pointToLayer={(feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 4,
              color: 'red',
              fillColor: 'black',
              weight: 0.5,
              fillOpacity: 0,
              opacity: 1,
            })
          }
          onEachFeature={(feature, layer) => {
            // Get pathOptions based on feature properties
            const colorOptions = getColorOptions(
              staticLayer?.id,
              feature.properties
            );
            const pathOptions = colorOptions?.pathOptions || {};

            // Apply style to the layer based on feature properties
            layer.setStyle(pathOptions);

            const popupHtml = getPopupHtml(staticLayer.id, feature.properties);
            layer.bindPopup(popupHtml);
          }}
        />
      ))}
    </>
  );
}
