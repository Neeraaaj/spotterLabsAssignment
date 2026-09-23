import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { decodePolyline } from '../src/utils/decodePolyline';

function MapPanel({ tripData }) {
  if (!tripData) {
    return (
      <div className="bg-card rounded-xl2 shadow-sm border border-line h-[480px] flex items-center justify-center text-muted">
        Plan a trip to see the route
      </div>
    );
  }

  const { current, pickup, dropoff, leg1, leg2 } = tripData;
  const leg1Points = decodePolyline(leg1.geometry);
  const leg2Points = decodePolyline(leg2.geometry);

  const center = [pickup.lat, pickup.lng];

  return (
    <div className="bg-card rounded-xl2 shadow-sm border border-line overflow-hidden h-[480px] relative">
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={leg1Points} color="#1a1a1a" weight={4} />
        <Polyline positions={leg2Points} color="#d4f22e" weight={4} />

        <Marker position={[current.lat, current.lng]}>
          <Popup>Current: {current.label}</Popup>
        </Marker>
        <Marker position={[pickup.lat, pickup.lng]}>
          <Popup>Pickup: {pickup.label}</Popup>
        </Marker>
        <Marker position={[dropoff.lat, dropoff.lng]}>
          <Popup>Dropoff: {dropoff.label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapPanel;