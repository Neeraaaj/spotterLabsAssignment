import { useState } from 'react';

function TripForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    cycleHoursUsed: '',
    tripStartTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-card rounded-xl2 shadow-sm border border-line h-[580px] p-6 flex flex-col">
      <h2 className="font-semibold text-ink mb-1">Trip Details</h2>
      <p className="text-muted text-sm mb-5">Enter your current status and trip info</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <Field
          label="Current Location"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          placeholder="e.g. Dallas, TX"
          errorText={error?.field === 'currentLocation' ? error.message : null}
        />
        <Field
            label="Trip Start Time"
            name="tripStartTime"
            type="datetime-local"
            value={formData.tripStartTime}
            onChange={handleChange}
        />
        <Field
          label="Pickup Location"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          placeholder="e.g. Fort Worth, TX"
          errorText={error?.field === 'pickupLocation' ? error.message : null}
        />
        <Field
          label="Dropoff Location"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          placeholder="e.g. Houston, TX"
          errorText={error?.field === 'dropoffLocation' ? error.message : null}
        />
        <Field
          label="Current Cycle Used (Hrs)"
          name="cycleHoursUsed"
          type="number"
          value={formData.cycleHoursUsed}
          onChange={handleChange}
          placeholder="e.g. 12"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-auto bg-accent text-ink font-medium rounded-xl py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Planning trip...' : 'Plan Trip'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text', errorText }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required
        className={`rounded-lg border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent ${
          errorText ? 'border-red-400' : 'border-line'
        }`}
      />
      {errorText && <span className="text-xs text-red-500">{errorText}</span>}
    </label>
  );
}

export default TripForm;