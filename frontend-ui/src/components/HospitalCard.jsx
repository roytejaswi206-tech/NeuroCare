const HospitalCard = ({ hospital, onNavigate }) => {
  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-text-main text-sm sm:text-base">{hospital.name}</h3>
            {hospital.emergency && (
              <span className="badge badge-error text-xs flex-shrink-0">Emergency</span>
            )}
          </div>
          <p className="text-text-muted text-sm truncate">{hospital.location}</p>
          
          <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-sm">
              <span className="text-warning">★</span>
              <span className="text-text-main font-medium">{hospital.rating}</span>
            </span>
            <span className="text-text-light text-xs">•</span>
            <span className="text-text-muted text-sm">{hospital.distance}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`badge ${hospital.open ? 'badge-success' : 'badge-error'} text-xs`}>
              {hospital.open ? 'Open Now' : 'Closed'}
            </span>
            {hospital.specializations && (
              <span className="text-text-light text-xs truncate">
                {hospital.specializations.slice(0, 2).join(', ')}
                {hospital.specializations.length > 2 && ` +${hospital.specializations.length - 2}`}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-shrink-0">
          <a 
            href={`tel:${hospital.phone}`}
            className="btn-primary py-2 px-3 text-sm whitespace-nowrap text-center"
          >
            Call
          </a>
          {onNavigate && (
            <button 
              onClick={onNavigate}
              className="btn-secondary py-2 px-3 text-sm whitespace-nowrap"
            >
              Directions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;