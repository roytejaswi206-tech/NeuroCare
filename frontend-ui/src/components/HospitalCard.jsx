const HospitalCard = ({ hospital, onNavigate }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--text-main)]">{hospital.name}</h3>
            {hospital.emergency && (
              <span className="badge badge-error text-xs">Emergency</span>
            )}
          </div>
          <p className="text-[var(--text-muted)] text-sm">{hospital.location}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-sm">
              <span className="text-[var(--warning)]">★</span>
              <span className="text-[var(--text-main)] font-medium">{hospital.rating}</span>
            </span>
            <span className="text-[var(--text-light)] text-xs">•</span>
            <span className="text-[var(--text-muted)] text-sm">{hospital.distance}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${hospital.open ? 'badge-success' : 'badge-error'} text-xs`}>
              {hospital.open ? 'Open Now' : 'Closed'}
            </span>
            {hospital.specializations && (
              <span className="text-[var(--text-light)] text-xs">
                {hospital.specializations.slice(0, 2).join(', ')}
                {hospital.specializations.length > 2 && ` +${hospital.specializations.length - 2}`}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <a 
            href={`tel:${hospital.phone}`}
            className="btn-primary py-1.5 px-3 text-sm whitespace-nowrap"
          >
            Call
          </a>
          {onNavigate && (
            <button 
              onClick={onNavigate}
              className="btn-secondary py-1.5 px-3 text-sm whitespace-nowrap"
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