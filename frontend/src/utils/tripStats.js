export function computeTripStats(tripData) {
  if (!tripData) return null;

  const { leg1, leg2, segments, cycle_hours_used } = tripData;
  const distanceMi = (leg1.distance_m + leg2.distance_m) / 1609.34;
  const drivingHrs = segments
    .filter((s) => s.status === 'driving')
    .reduce((sum, s) => sum + (s.end_hr - s.start_hr), 0);
  const onDutyHrs = segments
    .filter((s) => s.status === 'on_duty')
    .reduce((sum, s) => sum + (s.end_hr - s.start_hr), 0);
  const onDutyTotalHrs = drivingHrs + onDutyHrs;
  const cycleUsedTotal = cycle_hours_used + onDutyTotalHrs;

  return {
    distanceMi: Math.round(distanceMi),
    drivingHrs,
    onDutyTotalHrs,
    cycleUsedTotal,
    // HOS bars: how much of each limit is consumed by THIS trip alone
    drivingPct: Math.min(100, (drivingHrs / 11) * 100),
    windowPct: Math.min(100, (onDutyTotalHrs / 14) * 100),
    cyclePct: Math.min(100, (cycleUsedTotal / 70) * 100),
  };
}

export function formatHrsMin(hrs) {
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return `${h}h ${m}m`;
}