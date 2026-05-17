const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-4">
        <img 
          src={doctor.image} 
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border)]"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-main)]">{doctor.name}</h3>
          <p className="text-[var(--text-muted)] text-sm">{doctor.specialization}</p>
          <p className="text-[var(--text-muted)] text-xs mt-1">{doctor.hospital}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-sm">
              <span className="text-[var(--warning)]">★</span>
              <span className="text-[var(--text-main)] font-medium">{doctor.rating}</span>
            </span>
            <span className="text-[var(--text-light)] text-xs">•</span>
            <span className="text-[var(--text-muted)] text-xs">{doctor.experience} years exp.</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[var(--text-muted)] text-xs">{doctor.availability}</span>
        {onBook && (
          <button 
            onClick={onBook}
            className="btn-primary py-1.5 px-4 text-sm"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;