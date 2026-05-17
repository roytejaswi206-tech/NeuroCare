const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-3 sm:gap-4">
        <img 
          src={doctor.image} 
          alt={doctor.name}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-main text-sm sm:text-base truncate">{doctor.name}</h3>
          <p className="text-text-muted text-xs sm:text-sm">{doctor.specialization}</p>
          <p className="text-text-muted text-xs mt-1 truncate">{doctor.hospital}</p>
          
          <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-sm">
              <span className="text-warning">★</span>
              <span className="text-text-main font-medium">{doctor.rating}</span>
            </span>
            <span className="text-text-light text-xs">•</span>
            <span className="text-text-muted text-xs">{doctor.experience} years exp.</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-text-muted text-xs truncate">{doctor.availability}</span>
        {onBook && (
          <button 
            onClick={onBook}
            className="btn-primary py-2 px-4 text-sm flex-shrink-0 ml-2"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;