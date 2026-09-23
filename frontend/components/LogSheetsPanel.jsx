import LogSheetRow from './LogSheetRow';

function LogSheetsPanel({ days }) {
  const dayEntries = days ? Object.entries(days) : [];

  return (
    <div className="bg-card rounded-xl2 shadow-sm border border-line p-6">
      <h2 className="font-semibold text-ink mb-4">Daily Logs</h2>

      {dayEntries.length === 0 ? (
        <p className="text-muted text-sm">Plan a trip to see your log sheets</p>
      ) : (
        <div className="flex flex-col gap-4">
          {dayEntries.map(([date, segments]) => (
            <LogSheetRow key={date} date={date} segments={segments} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LogSheetsPanel;