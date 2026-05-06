import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const HospitalMap = ({ location, hospitals, ambulance, onMarkerClick }) => {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '420px', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={[location.lat, location.lng]}>
        <Popup>
          <div className="text-sm">
            <strong>You are here</strong>
          </div>
        </Popup>
      </Marker>

      {ambulance && (
        <Marker position={[ambulance.lat, ambulance.lon]}>
          <Popup>
            <div className="text-sm">
              <strong>Ambulance</strong>
              <p>Tracking in real time</p>
            </div>
          </Popup>
        </Marker>
      )}

      {hospitals.map((hospital) => (
        <Marker
          key={`${hospital.id}-${hospital.lat}-${hospital.lon}`}
          position={[hospital.lat, hospital.lon]}
          eventHandlers={{
            click: () => onMarkerClick?.(hospital),
          }}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{hospital.name}</p>
              <p>{hospital.address}</p>
              {hospital.distance != null && <p>{hospital.distance} km away</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HospitalMap;
