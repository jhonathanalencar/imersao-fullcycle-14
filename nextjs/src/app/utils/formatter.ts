export function formatDistance(distanceInMeters: number) {
  const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

  return `${distanceInKilometers} km`;
}

export function formatDuration(durationInSeconds: number) {
  const durationInMinutes = Math.ceil(durationInSeconds / 60);

  return `${durationInMinutes} min`;
}
