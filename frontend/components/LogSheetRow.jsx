const STATUS_ROWS = [
  { key: 'off_duty', label: 'Off Duty' },
  { key: 'sleeper', label: 'Sleeper Berth' },
  { key: 'driving', label: 'Driving' },
  { key: 'on_duty', label: 'On Duty' },
];

const STATUS_COLOR = {
  off_duty: '#b4b2a9',
  sleeper: '#7f77dd',
  driving: '#378add',
  on_duty: '#ef9f27',
};

function hourOfDay(isoString) {
  const d = new Date(isoString);
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
}

function LogSheetRow({ date, segments }) {
  return (
    <div className="border border-line rounded-xl p-4">
      <h3 className="font-medium text-ink mb-3">{date}</h3>

      <div className="flex flex-col gap-1">
        {STATUS_ROWS.map(({ key, label }) => {
          const rowSegments = segments.filter((s) => s.status === key);

          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-muted w-24 shrink-0">{label}</span>
              <div className="relative flex-1 h-6 bg-bg rounded overflow-hidden border border-line">
                {rowSegments.map((seg, i) => {
                  const startPct = (hourOfDay(seg.start_dt) / 24) * 100;
                  const endPct = (hourOfDay(seg.end_dt) / 24) * 100;
                  // Handle segment ending exactly at midnight (hourOfDay = 0)
                  const widthPct = endPct > startPct ? endPct - startPct : 100 - startPct;

                  return (
                    <div
                      key={i}
                      title={`${seg.note} (${new Date(seg.start_dt).toLocaleTimeString()} - ${new Date(seg.end_dt).toLocaleTimeString()})`}
                      className="absolute top-0 h-full"
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`,
                        background: STATUS_COLOR[key],
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-muted mt-1 pl-[6.5rem]">
        <span>Mid</span><span>6</span><span>Noon</span><span>18</span><span>Mid</span>
      </div>
    </div>
  );
}

export default LogSheetRow;