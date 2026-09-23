import { useState } from 'react';

function TripDetailsCard({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    currentLocation: '', pickupLocation: '', dropoffLocation: '',
    cycleHoursUsed: '', tripStartTime: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="bg-card border border-card-border rounded-[24px] p-5 h-full flex flex-col gap-4" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-bold tracking-tight">Trip details</div>
          <div className="text-[13px] text-muted mt-0.5">Current status and route</div>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />Planned
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-semibold text-muted">Route</div>
        <div className="bg-surface border border-line rounded-2xl px-3 py-1 flex gap-3">
          <div className="w-3.5 flex flex-col items-center py-4">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-ink" />
            <span className="flex-grow w-0 border-l-2 border-dotted border-gray-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="flex-grow w-0 border-l-2 border-dotted border-gray-400" />
            <span className="w-3 h-3 rounded-sm bg-ink" />
          </div>
          <div className="flex-grow flex flex-col">
            <RouteInput name="currentLocation" label="Current location" value={formData.currentLocation} onChange={handleChange} border />
            <RouteInput name="pickupLocation" label="Pickup" value={formData.pickupLocation} onChange={handleChange} border />
            <RouteInput name="dropoffLocation" label="Dropoff" value={formData.dropoffLocation} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <SmallField label="Trip start" name="tripStartTime" type="datetime-local" value={formData.tripStartTime} onChange={handleChange} />
        <SmallField label="Cycle used (hrs)" name="cycleHoursUsed" type="number" value={formData.cycleHoursUsed} onChange={handleChange} />
      </div>

      <div className="text-xs text-muted leading-relaxed">
        Property-carrying driver · 70 hr / 8-day cycle · 1 hr on-duty at pickup and dropoff
      </div>

      {error && <div className="text-xs text-red-600">{error.message}</div>}

      <button onClick={handleSubmit} disabled={loading}
        className="mt-auto h-[50px] rounded-full bg-accent text-white text-[15px] font-bold flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? 'Planning…' : 'Plan trip'}
      </button>
    </div>
  );
}

function RouteInput({ name, label, value, onChange, border }) {
  return (
    <label className={`flex flex-col py-1.5 ${border ? 'border-b border-divider' : ''}`}>
      <span className="text-[11px] text-muted">{label}</span>
      <input name={name} value={value} onChange={onChange} required
        className="border-none outline-none p-0 text-sm font-semibold text-ink bg-transparent" />
    </label>
  );
}

function SmallField({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} required
        className="h-11 border border-line rounded-2xl px-3 text-sm font-semibold text-ink bg-surface" />
    </label>
  );
}

export default TripDetailsCard;