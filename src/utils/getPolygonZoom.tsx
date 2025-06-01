import L from 'leaflet';

export function getPolygonZoom(map: L.Map, polygonCoords: [number, number][]): number {
  const latLngs = polygonCoords.map(([lat, lng]) => L.latLng(lat, lng));
  const bounds = L.latLngBounds(latLngs);
  return map.getBoundsZoom(bounds);
}

export default getPolygonZoom;
