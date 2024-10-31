import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search' }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded && !value) {
          setIsExpanded(false);
          showLogo();
        }
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onChange('');
        setIsExpanded(false);
        showLogo();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isExpanded, value, onChange]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const hideLogo = () => {
    const logo = document.querySelector('[data-search-hide]');
    if (logo && window.innerWidth < 768) { // md breakpoint
      logo.classList.add('invisible');
    }
  };

  const showLogo = () => {
    const logo = document.querySelector('[data-search-hide]');
    if (logo) {
      logo.classList.remove('invisible');
    }
  };

  const handleSearchClick = () => {
    setIsExpanded(true);
    hideLogo();
  };

  const handleClearClick = () => {
    onChange('');
    setIsExpanded(false);
    showLogo();
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <div
        className={`
          flex items-center
          ${isExpanded 
            ? 'w-72 absolute right-0 md:relative md:right-auto' 
            : 'w-8 relative'
          }
          transition-all duration-200 ease-in-out
        `}
        style={{ zIndex: isExpanded ? 40 : 'auto' }}
      >
        {!isExpanded ? (
          <button
            onClick={handleSearchClick}
            className="p-1.5 text-white/80 hover:text-white hover:bg-sky/10 rounded-md transition-colors"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : (
          <div className="relative w-full flex items-center">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/60" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="block w-full pl-8 pr-8 py-1.5 bg-sky/10 backdrop-blur-sm border border-sky/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sky/20"
              placeholder={placeholder}
              aria-label="Search input"
            />
            {value && (
              <button
                onClick={handleClearClick}
                className="absolute right-2 p-0.5 text-white/60 hover:text-white/80 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}