import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { hospitalsAPI } from '../services/api';
import { MapPin, Phone, Navigation, Clock, Star, Search, Bookmark, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import HospitalCard from '../components/HospitalCard';
import { useToast } from '../components/ToastContext';
import HospitalMap from '../components/HospitalMap';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 26.1445,
  lng: 91.7362,
};

const demoPlaces = [
  {
    id: 1,
    name: "Apollo Hospital Guwahati",
    lat: 26.1445,
    lon: 91.7362,
    type: "hospital",
    address: "Guwahati, Assam",
    rating: 4.5,
    distance: 0.5,
  },
  {
    id: 2,
    name: "City Clinic",
    lat: 26.1480,
    lon: 91.7380,
    type: "clinic",
    address: "Guwahati, Assam",
    rating: 4.2,
    distance: 1.1,
  },
  {
    id: 3,
    name: "Healthcare Plus",
    lat: 26.1400,
    lon: 91.7340,
    type: "hospital",
    address: "Guwahati, Assam",
    rating: 4.7,
    distance: 1.5,
  },
];

const Hospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [ambulance, setAmbulance] = useState(null);
  const { showToast } = useToast();

  const fetchHospitals = useCallback(async () => {
    if (!location) return;
    
    try {
      const res = await fetch(`/api/places/nearby?lat=${location.lat}&lng=${location.lng}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        if (data.length > 0) {
          setHospitals(data);
          setError('');
          showToast('Nearby hospitals loaded successfully.', 'success');
        } else {
          setHospitals(demoPlaces);
          setError('');
          showToast('Showing demo hospitals in your area.', 'info');
        }
      } else {
        setHospitals(demoPlaces);
        setError('');
      }
    } catch (err) {
      console.error('Failed to fetch places:', err);
      setHospitals(demoPlaces);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [location, showToast]);

  useEffect(() => {
    setLoading(true);
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchHospitals();
      const interval = setInterval(() => {
        setAmbulance((prev) => {
          if (!prev) {
            return {
              lat: location.lat + 0.0015,
              lon: location.lng + 0.0015,
            };
          }
          return {
            lat: prev.lat + (Math.random() - 0.5) * 0.0015,
            lon: prev.lon + (Math.random() - 0.5) * 0.0015,
          };
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [location]);

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
    const lat = hospital.lat;
    const lng = hospital.lon || hospital.lng;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${position.coords.latitude},${position.coords.longitude};${lat},${lng}`;
        window.open(url, '_blank');
      });
    } else {
      const url = `https://www.openstreetmap.org/#map=15/${lat}/${lng}`;
      window.open(url, '_blank');
    }
  };

  const filteredHospitals = useMemo(() => {
    const filtered = hospitals
      .filter((hospital) => {
        const matchesSearch =
          hospital.name?.toLowerCase().includes(search.toLowerCase()) ||
          hospital.type?.toLowerCase().includes(search.toLowerCase()) ||
          hospital.address?.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || hospital.type === filterType;
        return matchesSearch && matchesType;
      })
      .map((hospital) => {
        const distance = location
          ? Math.sqrt(
              Math.pow((hospital.lat - location.lat) * 110.574, 2) +
              Math.pow((hospital.lon - location.lng) * 111.320 * Math.cos((location.lat * Math.PI) / 180), 2)
            )
          : null;
        return {
          ...hospital,
          distance: distance ? Number(distance.toFixed(2)) : hospital.distance,
        };
      });

    return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [hospitals, search, filterType, location]);

  const savePlace = async (place) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/places/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: place.name,
          lat: place.lat,
          lon: place.lon,
          type: place.type,
          address: place.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save place');
      }

      showToast('Place saved to favorites.', 'success');
    } catch (err) {
      console.error('Save place failed:', err);
      showToast(err.message || 'Unable to save place.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-neuro-accent" size={24} />
            <div>
              <h1 className="text-2xl font-bold neon-text">Nearby Healthcare Places</h1>
              <p className="text-sm text-gray-400">Find hospitals, clinics, and pharmacies near you.</p>
            </div>
          </div>
          <div className="relative max-w-md w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospitals, clinics, pharmacies..."
              className="w-full rounded-3xl bg-white/5 border border-white/10 px-12 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition"
            />
          </div>
        </div>

        <div className="glass-card p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-300 border border-white/10">
          <span>{filteredHospitals.length} nearby results</span>
          <span>Showing {filterType === 'all' ? 'all categories' : filterType}</span>
        </div>

        <div className="glass-card p-6 mb-8 flex flex-wrap gap-4 items-center justify-center border border-white/15">
          {[
            { key: 'all', label: 'All', icon: '🏥' },
            { key: 'hospital', label: 'Hospitals', icon: '🏥' },
            { key: 'clinic', label: 'Clinics', icon: '🏥' },
            { key: 'pharmacy', label: 'Pharmacies', icon: '💊' }
          ].map((type) => (
            <motion.button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-3 shadow-lg border ${
                filterType === type.key 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] border-blue-400/50 scale-105' 
                  : 'glass-card hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:scale-105 border-white/20 hover:border-blue-400/30'
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: type.key === 'all' ? 0 : 0.1 * ['all', 'hospital', 'clinic', 'pharmacy'].indexOf(type.key) }}
            >
              <span className="text-lg">{type.icon}</span>
              {type.label}
            </motion.button>
          ))}
        </div>

        {error && (
          <motion.div 
            className="glass-card p-6 mb-8 text-center text-yellow-300 border border-yellow-400/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="font-semibold">⚠️ Using demo hospitals - API unavailable</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Map */}
          <motion.div 
            className="glass-card p-6 rounded-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-blue-400" />
              Live Map
            </h3>
            {loading ? (
              <div className="h-[420px] rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center">
                <SkeletonLoader count={1} height="h-96" className="w-full max-w-2xl" />
              </div>
            ) : (
              <HospitalMap
                location={location || defaultCenter}
                hospitals={filteredHospitals}
                ambulance={ambulance}
                onMarkerClick={handleMarkerClick}
              />
            )}
          </motion.div>

          {/* Hospitals List */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {loading ? (
              <SkeletonLoader count={4} type="hospital" />
            ) : filteredHospitals.length === 0 ? (
              <motion.div 
                className="glass-card p-12 text-center rounded-3xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <MapPin className="w-20 h-20 text-gray-500 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No hospitals found nearby</h3>
                <p className="text-gray-500 mb-6">Try adjusting filters or search terms</p>
                <button 
                  onClick={getUserLocation}
                  className="neon-button px-8 py-3 rounded-2xl font-semibold"
                >
                  Refresh Location
                </button>
              </motion.div>
            ) : (
              filteredHospitals.map((hospital) => (
                <HospitalCard
                  key={`${hospital.id}-${hospital.lat}-${hospital.lon}`}
                  hospital={hospital}
                  location={location}
                  onNavigate={handleDirections}
                  onCall={handleCall}
                  onSave={savePlace}
                />
              ))
            )}
          </motion.div>
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
