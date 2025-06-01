function getPolygonCenter(coords: any) {
  const total = coords.length;
  const sum = coords.reduce(
    (acc: any, [lat, lng]: any) => {
      acc.lat += lat;
      acc.lng += lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  return [sum.lat / total, sum.lng / total];
}

export default getPolygonCenter;
