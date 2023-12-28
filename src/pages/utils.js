export const secondsToMMSS = (seconds) => {
  const MM = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const SS = (seconds % 60).toString().padStart(2, '0');
  return `${MM}:${SS}`;
};

export const calculateTotalDuration = (intervals) => {
  const durationInSeconds = intervals.reduce((total, interval) => total + (interval.duration || 0), 0);
  return secondsToMMSS(durationInSeconds);
};
