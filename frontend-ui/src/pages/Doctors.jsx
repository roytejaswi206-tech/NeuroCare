import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../utils/storage';
import Navbar from '../components/Navbar';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setDoctors(getDoctors());
  }, []);

  // Get unique specializations for filters
  const specializations = [...new Set(doctors.map(d => d.specialization))];
  
  const filters = [
    { label: 'All', value: 'all' },
    ...specializations.map(s => ({ label: s, value: s }))
  ];

  const filteredDoctors = doctors.filter(doctor => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    let matchesFilter = true;
    if (activeFilter !== 'all') {
      matchesFilter = doctor.specialization === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        {/* Header with background image */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-accent to-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop" 
              alt="Doctor background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Find Doctors</h1>
            <p className="text-white/80 text-sm sm:text-base">Connect with experienced healthcare professionals</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          {/* Search Card */}
          <div className="card p-4 sm:p-5 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, specialization, or hospital..."
              onClear={() => setSearchQuery('')}
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-text-muted text-sm">
              Showing <span className="font-semibold text-text-main">{filteredDoctors.length}</span> doctors
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor}
                  onBook={() => {
                    navigate('/appointments');
                  }}
                />
              ))
            ) : (
              <div className="col-span-full card p-8 text-center fade-in">
                <div className="text-4xl mb-3">👨‍⚕️</div>
                <h3 className="font-semibold text-text-main mb-1">No doctors found</h3>
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

export default Doctors;