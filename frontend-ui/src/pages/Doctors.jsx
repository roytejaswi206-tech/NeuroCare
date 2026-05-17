import { useState, useEffect } from 'react';
import { getDoctors } from '../utils/storage';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header with background image */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop" 
            alt="Doctor background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-2">Find Doctors</h1>
          <p className="text-white/80">Connect with experienced healthcare professionals</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 -mt-8 relative z-20">
        {/* Search Card */}
        <div className="card p-5 mb-6">
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

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor}
                onBook={() => {
                  alert(`Booking appointment with ${doctor.name}...`);
                }}
              />
            ))
          ) : (
            <div className="col-span-full card p-8 text-center">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold text-[var(--text-main)] mb-1">No doctors found</h3>
              <p className="text-[var(--text-muted)] text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Doctors;