import { useState, useEffect } from 'react';
import { getHospitals } from '../utils/storage';
import HospitalCard from '../components/HospitalCard';
import SearchBar from '../components/SearchBar';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setHospitals(getHospitals());
  }, []);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Open Now', value: 'open' },
    { label: 'Emergency', value: 'emergency' }
  ];

  const filteredHospitals = hospitals.filter(hospital => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    let matchesFilter = true;
    if (activeFilter === 'open') matchesFilter = hospital.open;
    if (activeFilter === 'emergency') matchesFilter = hospital.emergency;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header with background image */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop" 
            alt="Hospital background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-2">Find Hospitals</h1>
          <p className="text-white/80">Search and find hospitals near you</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 -mt-8 relative z-20">
        {/* Search Card */}
        <div className="card p-5 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, location, or specialization..."
            onClear={() => setSearchQuery('')}
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map(hospital => (
              <HospitalCard 
                key={hospital.id} 
                hospital={hospital}
                onNavigate={() => {
                  // Open maps with hospital location
                  const query = encodeURIComponent(`${hospital.name} ${hospital.location}`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }}
              />
            ))
          ) : (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="font-semibold text-[var(--text-main)] mb-1">No hospitals found</h3>
              <p className="text-[var(--text-muted)] text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Hospitals;