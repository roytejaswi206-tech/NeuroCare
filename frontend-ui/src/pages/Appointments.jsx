import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDoctors } from '../utils/storage';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('neurocare_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // Sample appointments
      const doctors = getDoctors();
      setAppointments([
        {
          id: 1,
          doctor: doctors[0],
          date: new Date(Date.now() + 86400000).toISOString(),
          time: '10:00 AM',
          reason: 'General consultation',
          status: 'confirmed'
        },
        {
          id: 2,
          doctor: doctors[1],
          date: new Date(Date.now() + 172800000).toISOString(),
          time: '2:30 PM',
          reason: 'Follow-up session',
          status: 'pending'
        }
      ]);
    }
  }, []);

  const bookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) return;

    const doctors = getDoctors();
    const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));

    const appointment = {
      id: Date.now(),
      doctor,
      date: selectedDate,
      time: selectedTime,
      reason,
      status: 'pending'
    };

    const updated = [appointment, ...appointments];
    setAppointments(updated);
    localStorage.setItem('neurocare_appointments', JSON.stringify(updated));
    
    // Reset form
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setShowForm(false);
  };

  const cancelAppointment = (id) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('neurocare_appointments', JSON.stringify(updated));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      cancelled: 'badge-error'
    };
    return `<span class="badge ${styles[status]} text-xs capitalize">${status}</span>`;
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4 lg:pt-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Appointments</h1>
              <p className="text-text-muted text-sm">Manage your scheduled sessions</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary py-2 px-4 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Book Appointment</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {appointments.filter(a => a.status === 'confirmed').length}
              </div>
              <p className="text-text-muted text-xs">Confirmed</p>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
              <p className="text-text-muted text-xs">Pending</p>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-text-main">
                {appointments.length}
              </div>
              <p className="text-text-muted text-xs">Total</p>
            </div>
          </div>

          {/* Booking Form */}
          {showForm && (
            <div className="card p-4 sm:p-6 mb-6 fade-in">
              <h2 className="text-lg font-semibold text-text-main mb-4">Book New Appointment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-text-muted text-sm mb-1.5">Select Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Choose a doctor...</option>
                    {getDoctors().map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-muted text-sm mb-1.5">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted text-sm mb-1.5">Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full"
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-1.5">Reason for Visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe why you're booking this appointment..."
                    rows="3"
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={bookAppointment} className="btn-primary py-2 px-4">
                    Book Appointment
                  </button>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="btn-secondary py-2 px-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments List */}
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="card p-4 sm:p-5 fade-in">
                  <div className="flex items-start gap-4">
                    <img
                      src={appointment.doctor?.image}
                      alt={appointment.doctor?.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-main">{appointment.doctor?.name}</h3>
                        <span 
                          className={`badge text-xs capitalize ${
                            appointment.status === 'confirmed' ? 'badge-success' :
                            appointment.status === 'pending' ? 'badge-warning' : 'badge-error'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm">{appointment.doctor?.specialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatDate(appointment.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {appointment.time}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm mt-2">{appointment.reason}</p>
                    </div>
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="text-text-light hover:text-error transition-colors p-2 flex-shrink-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center fade-in">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-text-main mb-1">No appointments yet</h3>
                <p className="text-text-muted text-sm">Book your first appointment with a specialist</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 btn-primary py-2 px-4"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;