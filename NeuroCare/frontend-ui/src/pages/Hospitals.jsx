import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { hospitalsAPI } from '../services/api';
import { MapPin, Phone, Navigation, Clock, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useToast } from '../components/ToastContext';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const Hospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const googleKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { showToast } = useToast();

    const fetchHospitals = useCallback(async () => {
    try {
      const response = await hospitalsAPI.getHospitals({ lat: location.lat, lng: location.lng });
      setHospitals(response.data.hospitals || []);
      showToast('Hospitals loaded successfully. Tap a marker for details.', 'success');
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
      setError('Failed to load hospitals');
      showToast('Unable to load hospitals. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [location, showToast]);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchHospitals();
    }
  }, [location, fetchHospitals]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocation(defaultCenter);
        }
      );
    } else {
      setLocation(defaultCenter);
    }
  };

  const fetchDoctors = async (hospitalId) => {
    try {
      const response = await hospitalsAPI.getHospitalDoctors(hospitalId);
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const handleMarkerClick = (hospital) => {
    setSelectedHospital(hospital);
    fetchDoctors(hospital.id);
    showToast(`Selected ${hospital.name}. Showing doctors and details.`, 'info');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neuro-dark">
        <Navbar />
        <Loader text="Loading hospitals..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-neuro-accent" size={24} />
          <h1 className="text-2xl font-bold neon-text">Nearby Hospitals</h1>
        </div>

        {error && (
          <div className="bg-neuro-danger/20 border border-neuro-danger text-neuro-danger p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Map */}
          <div className="glass-card p-4">
            {googleKey ? (
              <LoadScript googleMapsApiKey={googleKey}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location || defaultCenter}
                  zoom={13}
                  options={{
                    styles: [
                      {
                        featureType: 'all',
                        elementType: 'geometry',
                        stylers: [{ color: '#1a1a2e' }],
                      },
                      {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#16213e' }],
                      },
                    ],
                  }}
                >
                  <Marker
                    position={location || defaultCenter}
                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  />
                  
                  {hospitals.map((hospital) => (
                    <Marker
                      key={hospital.id}
                      position={{ lat: hospital.lat, lng: hospital.lng }}
                      onClick={() => handleMarkerClick(hospital)}
                      icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    />
                  ))}

                  {selectedHospital && (
                    <InfoWindow
                      position={{ lat: selectedHospital.lat, lng: selectedHospital.lng }}
                      onCloseClick={() => setSelectedHospital(null)}
                    >
                      <div className="text-gray-900 min-w-[200px]">
                        <h3 className="font-bold">{selectedHospital.name}</h3>
                        <p className="text-sm">{selectedHospital.address}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={14} className="text-yellow-500" />
                          <span className="text-sm">{selectedHospital.rating}</span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400">
                Google Maps API key is missing. Please set <span className="font-semibold text-white">REACT_APP_GOOGLE_MAPS_API_KEY</span> in <span className="font-semibold text-white">frontend-ui/.env</span>.
              </div>
            )}
          </div>

          {/* Hospital List */}
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="glass-card p-4 cursor-pointer hover:border-neuro-accent transition-colors"
                onClick={() => handleMarkerClick(hospital)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{hospital.name}</h3>
                    <p className="text-sm text-gray-400">{hospital.address}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm">{hospital.rating}</span>
                      </div>
                      
                      {hospital.available_24x7 && (
                        <span className="text-xs bg-neuro-success/20 text-neuro-success px-2 py-1 rounded">
                          24/7
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {hospital.contact && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(hospital.contact);
                        }}
                        className="p-2 bg-neuro-card rounded-lg hover:bg-neuro-accent hover:text-white transition-colors"
                      >
                        <Phone size={18} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirections(hospital);
                      }}
                      className="p-2 bg-neuro-card rounded-lg hover:bg-neuro-accent hover:text-white transition-colors"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {hospitals.length === 0 && (
              <div className="glass-card p-8 text-center">
                <MapPin size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No hospitals found nearby</p>
              </div>
            )}
          </div>
        </div>

        {/* Doctors Section */}
        {selectedHospital && doctors.length > 0 && (
          <div className="mt-6 glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Doctors at {selectedHospital.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-neuro-card/50 p-4 rounded-lg">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-neuro-accent">{doctor.specialization}</p>
                  <p className="text-sm text-gray-400">{doctor.qualification}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{doctor.timing}</span>
                    </div>
                    <span>${doctor.fees}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {doctor.phone && (
                      <button
                        onClick={() => handleCall(doctor.phone)}
                        className="flex-1 bg-neuro-accent text-white py-2 rounded-lg text-sm"
                      >
                        Call
                      </button>
                    )}
                    <button
                      onClick={() => handleDirections(selectedHospital)}
                      className="flex-1 border border-neuro-accent text-neuro-accent py-2 rounded-lg text-sm"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
