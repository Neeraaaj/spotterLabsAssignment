import { useState } from 'react';
import LogSheetRow from './LogSheetRow';

function DailyLogCard({ days }) {
  const dayEntries = days ? Object.entries(days) : [];
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="bg-card border border-card-border rounded-[24px] p-5 h-full flex flex-col gap-4" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold tracking-tight">Daily log</div>
          {dayEntries[activeDay] && (
            <span className="px-2.5 py-1 rounded-full bg-surface text-xs font-semibold">
              {new Date(dayEntries[activeDay][0]).toDateString()}
            </span>
          )}
        </div>
        {dayEntries.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface">
            {dayEntries.map(([date], i) => (
              <button key={date} onClick={() => setActiveDay(i)}
                className={`h-9 px-3.5 rounded-full text-xs font-semibold ${i === activeDay ? 'bg-ink text-white' : 'text-muted'}`}>
                Day {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {dayEntries.length === 0 ? (
        <p className="text-muted text-sm">Plan a trip to see your log sheets</p>
      ) : (
        <LogSheetRow date={dayEntries[activeDay][0]} segments={dayEntries[activeDay][1]} />
      )}
    </div>
  );
}

export default DailyLogCard;