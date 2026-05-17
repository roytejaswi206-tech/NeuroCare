import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHospitals } from '../utils/storage';
import Navbar from '../components/Navbar';
import HospitalCard from '../components/HospitalCard';
import SearchBar from '../components/SearchBar';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        {/* Header with background image */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary to-accent overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop" 
              alt="Hospital background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Find Hospitals</h1>
            <p className="text-white/80 text-sm sm:text-base">Search and find hospitals near you</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          {/* Search Card */}
          <div className="card p-4 sm:p-5 mb-6">
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

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-text-muted text-sm">
              Showing <span className="font-semibold text-text-main">{filteredHospitals.length}</span> hospitals
            </p>
          </div>

          {/* Results List */}
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
              <div className="card p-8 text-center fade-in">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="font-semibold text-text-main mb-1">No hospitals found</h3>
                <p className="text-text-muted text-sm">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 btn-primary py-2 px-4 text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hospitals;