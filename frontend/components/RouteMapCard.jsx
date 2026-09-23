import MapPanel from './MapPanel';

function RouteMapCard({ tripData }) {
  return (
    <div className="relative rounded-[24px] overflow-hidden border border-card-border h-full">
      <MapPanel tripData={tripData} />

      <div className="absolute left-5 top-5 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white z-[1000]" style={{ boxShadow: '0 2px 8px rgba(16,24,40,0.06)' }}>
        <span className="text-base font-bold">Route map</span>
      </div>

      {tripData && (
        <div className="absolute left-5 bottom-5 flex flex-col gap-2 z-[1000]">
          <LegChip color="#111827" from="Current" to="Pickup" miles={tripData.leg1.distance_m / 1609.34} secs={tripData.leg1.duration_s} />
          <LegChip color="#2563EB" from="Pickup" to="Dropoff" miles={tripData.leg2.distance_m / 1609.34} secs={tripData.leg2.duration_s} />
        </div>
      )}
    </div>
  );
}

function LegChip({ color, from, to, miles, secs }) {
  const hrs = Math.floor(secs / 3600), mins = Math.round((secs % 3600) / 60);
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white" style={{ boxShadow: '0 2px 8px rgba(16,24,40,0.06)' }}>
      <span className="w-4.5 h-1 rounded-full" style={{ background: color, width: 18, height: 4 }} />
      <span className="text-[13px] font-semibold">{from} → {to}</span>
      <span className="text-[13px] text-muted">{Math.round(miles)} mi · {hrs}h {mins}m</span>
    </div>
  );
}

export default RouteMapCard;