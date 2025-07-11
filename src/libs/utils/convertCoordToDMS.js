export default function convertCoordToDMS(lat, lon) {
  const toDMS = (degree, isLat) => {
    const absolute = Math.abs(degree);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.floor((minutesFloat - minutes) * 60);

    const direction = degree >= 0 ? (isLat ? 'N' : 'E') : isLat ? 'S' : 'W';

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${toDMS(lat, true)}, ${toDMS(lon, false)}`;
}
