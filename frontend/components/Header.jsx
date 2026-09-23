import { computeTripStats, formatHrsMin } from '../src/utils/tripStats';

const NAV_ICONS = [
  { label: 'Home', path: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
];

function Header({ tripData }) {
  const stats = computeTripStats(tripData);

  return (
    <header className="h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="19" r="2" /><circle cx="18" cy="5" r="2" />
              <path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16" />
            </svg>
          </div>
          <div className="text-[2vw] font-bold tracking-tight font-sans">ELD Trip Planner</div>
        </div>
        <nav className="flex items-center gap-2">
          <button aria-label="Home" className="w-11 h-11 rounded-full bg-card text-icon flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={NAV_ICONS[0].path} /></svg>
          </button>
          <button className="h-11 px-4 rounded-full bg-surface text-ink flex items-center gap-2 text-sm font-semibold" style={{ boxShadow: '0 1px 3px rgba(16,24,40,0.08)' }}>
            Trip planner
          </button>
        </nav>
      </div>

      {stats && (
        <div className="flex items-center gap-9">
          <Kpi dot="#2563EB" label="Total distance" value={`${stats.distanceMi}`} unit="mi" />
          <Kpi dot="#16A34A" label="Driving time" value={formatHrsMin(stats.drivingHrs)} />
          <Kpi dot="#D97706" label="On-duty total" value={formatHrsMin(stats.onDutyTotalHrs)} />
          <Kpi dot="#DC2626" label="Cycle used" value={stats.cycleUsedTotal.toFixed(1)} unit="/ 70h" />
        </div>
      )}

      {/* <div className="flex items-center gap-2">
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-card text-icon flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /></svg>
        </button>
        <div className="w-11 h-11 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-sm font-bold">D</div>
      </div> */}
    </header>
  );
}

function Kpi({ dot, label, value, unit }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5 items-start">
        <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: dot }} />
        <span className="text-xs leading-[15px] text-muted">{label.split(' ')[0]}<br />{label.split(' ').slice(1).join(' ')}</span>
      </div>
      <div className="text-[30px] font-semibold tracking-tight">
        {value}{unit && <span className="text-[15px] text-muted font-medium ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default Header;