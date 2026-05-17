const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  onClear,
  filters = [],
  activeFilter,
  onFilterChange 
}) => {
  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--text-main)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;