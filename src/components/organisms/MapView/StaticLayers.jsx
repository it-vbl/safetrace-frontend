'use client'; // if using App Router

import { useEffect, useState } from 'react';
import { Polygon } from 'react-leaflet';

import petaIup from '@/constants/peta-iup'; // Adjust the path if needed

function cleanCoordinates(multiPolygon) {
  if (!Array.isArray(multiPolygon)) return [];

  return multiPolygon
    .map((polygon) =>
      Array.isArray(polygon)
        ? polygon
            .map(
              (ring) =>
                ring
                  .filter(
                    (coord) =>
                      Array.isArray(coord) &&
                      coord.length >= 2 &&
                      typeof coord[0] === 'number' &&
                      typeof coord[1] === 'number'
                  )
                  .map((coord) => [coord[0], coord[1]]) // convert [lng, lat] → [lat, lng]
            )
            .filter((ring) => ring.length > 2) // valid ring
        : []
    )
    .filter((polygon) => polygon.length > 0); // valid polygon
}

const colorObject = {
  1: {
    key: 'sipekebun-desa',
    pathOptions: {
      fill: '#C0C0C000',
      fillOpacity: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      weight: 1,
    },
  },
  2: {
    key: 'sipekebun-desa',
    pathOptions: {
      color: `#7A7A7A`,
      dashArray: '5 7',
      dashOffset: '1',
      lineCap: 'square',
      weight: 1,
      fillOpacity: 0,
    },
  },
  3: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      color: `#7A7A7A`,
      fillOpacity: 0,
      lineCap: 'square',
      lineJoin: 'square',
      dashArray: '6 3 6 3 12 3',
      dashOffset: '1',
      weight: 1,
    },
  },
  4: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#9B4E23',
      stroke: true,
      fillOpacity: 1,
      color: `#654230`,
      weight: 1,
    },
  },
  5: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#C93D80',
      fillOpacity: 1,
      border: false,
      weight: 0,
    },
  },
};

export default function IupMap({ data }) {
  const [polygons, setPolygons] = useState([]);
  useEffect(() => {
    const tempArray = [];
    Object.keys(data).map((params, idx, array) => {
      tempArray.push({
        ...data[params],
      });
    });

    const tempPolygons = [];
    tempArray.map((staticLayer, idx) => {
      const features = staticLayer?.geom?.features || [];

      const parsedPolygons = features
        .filter((feature) => feature?.geometry)
        .flatMap((feature) => {
          const geometry = feature.geometry;
          if (geometry?.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
            const filteredCoordinates = geometry.coordinates.filter((coord) => Array.isArray(coord));
            return cleanCoordinates(filteredCoordinates);
          }
          return [];
        });

      tempPolygons.push({
        polygons: parsedPolygons,
        id: staticLayer.id,
      });
    });
    setPolygons(tempPolygons);
  }, [data]);

  return (
    <>
      {polygons.map((staticLayer, idx) =>
        staticLayer?.polygons?.map((polygon) => {
          return polygon.map((ring, ringIdx) => {
            return (
              <Polygon
                key={`${idx}-${ringIdx}`}
                pathOptions={colorObject[staticLayer.id].pathOptions}
                positions={ring?.map((coords) => [coords[1], [coords[0]]])}
              />
            );
          });
        })
      )}
    </>
  );
}
