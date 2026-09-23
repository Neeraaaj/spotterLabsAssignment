import { computeTripStats } from '../src/utils/tripStats';

function HosAndStopsCard({ tripData }) {
  const stats = computeTripStats(tripData);

  return (
    <div className="bg-card border border-card-border rounded-[24px] p-5 h-full flex flex-col gap-4" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}>
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold tracking-tight">Hours of service</div>
        {stats && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stats.drivingPct >= 100 ? 'bg-red-100 text-red-700' : 'bg-success-bg text-success-fg'}`}>
            {stats.drivingPct >= 100 ? 'Violation' : 'Compliant'}
          </span>
        )}
      </div>

      {stats ? (
        <div className="flex flex-col gap-3.5 bg-surface rounded-2xl p-4">
          <HosBar label="Driving limit" used={stats.drivingHrs} limit={11} pct={stats.drivingPct} />
          <HosBar label="Duty window" used={stats.onDutyTotalHrs} limit={14} pct={stats.windowPct} />
          <HosBar label="70-hr cycle" used={stats.cycleUsedTotal} limit={70} pct={stats.cyclePct} decimals={1} />
        </div>
      ) : (
        <p className="text-muted text-sm">Plan a trip to see HOS status</p>
      )}

      <div className="flex justify-between items-center mt-1">
        <div className="text-lg font-bold tracking-tight">Stops</div>
        {tripData && <span className="text-xs text-muted font-semibold">{tripData.segments.length} events</span>}
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto">
        {tripData?.segments.map((seg, i) => (
          <StopRow key={i} seg={seg} />
        ))}
      </div>
    </div>
  );
}

function HosBar({ label, used, limit, pct, decimals = 0 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-bold">{used.toFixed(decimals === 0 ? 1 : decimals)}<span className="text-muted font-medium"> / {limit}h</span></span>
      </div>
      <div className="h-2 rounded bg-track overflow-hidden">
        <div className="h-2 rounded" style={{ width: `${pct}%`, background: pct >= 100 ? '#DC2626' : pct >= 80 ? '#D97706' : '#2563EB' }} />
      </div>
    </div>
  );
}

function StopRow({ seg }) {
  const time = new Date(seg.start_dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isOnDuty = seg.status === 'on_duty';
  return (
    <div className="flex gap-3 items-center p-3.5 rounded-2xl bg-white border border-card-border">
      <div className="w-11 h-11 rounded-2xl bg-surface-muted flex items-center justify-center shrink-0" />
      <div className="flex-grow flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-bold truncate">{seg.note}</span>
        <span className="text-xs text-muted capitalize">{seg.status.replace('_', ' ')}</span>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-bold">{time}</span>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${isOnDuty ? 'bg-warn-bg text-warn-fg' : 'bg-surface-muted text-ink'}`}>
          {seg.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}

export default HosAndStopsCard;