import { useState } from 'react';
import Header from '../components/Header';
import TripDetailsCard from '../components/TripDetailsCard';
import RouteMapCard from '../components/RouteMapCard';
import HosAndStopsCard from '../components/HosAndStopsCard';
import DailyLogCard from '../components/DailyLogCard';

function App() {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);

  const handleTripSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/plan-trip/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw { message: errBody.error, field: errBody.field };
      }
      const data = await res.json();
      setTripData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-6">
      <Header tripData={tripData} />

      <div
        className="grid gap-5 mt-5"
        style={{ gridTemplateColumns: '340px 1fr 330px', gridTemplateRows: '480px 368px' }}
      >
        <div style={{ gridColumn: 1, gridRow: 1 }}>
          <TripDetailsCard onSubmit={handleTripSubmit} loading={loading} error={error} />
        </div>
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <RouteMapCard tripData={tripData} />
        </div>
        <div style={{ gridColumn: 3, gridRow: '1 / span 2' }}>
          <HosAndStopsCard tripData={tripData} />
        </div>
        <div style={{ gridColumn: '1 / span 2', gridRow: 2 }}>
          <DailyLogCard days={tripData?.days} />
        </div>
      </div>
    </div>
  );
}

export default App;