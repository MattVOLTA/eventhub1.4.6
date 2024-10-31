import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

interface LocationFilterProps {
  locations: string[];
  selectedLocations: string[];
  onChange: (selectedLocations: string[]) => void;
}

export function LocationFilter({ locations, selectedLocations, onChange }: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationClick = (location: string) => {
    if (selectedLocations.includes(location)) {
      onChange(selectedLocations.filter(loc => loc !== location));
    } else {
      onChange([...selectedLocations, location]);
    }
  };

  const handleSelectAllClick = () => {
    const allSelected = selectedLocations.length === locations.length;
    onChange(allSelected ? [] : [...locations]);
  };

  const getButtonText = () => {
    if (locations.length === 0) return 'No Locations';
    if (selectedLocations.length === 0) return 'No Locations Selected';
    if (selectedLocations.length === locations.length) return 'All Locations';
    return `${selectedLocations.length} Location${selectedLocations.length === 1 ? '' : 's'}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
      >
        <span className="mr-2">{getButtonText()}</span>
        <ChevronsUpDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
            {locations.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleSelectAllClick}
                  className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                    {selectedLocations.length === locations.length && (
                      <Check className="h-4 w-4 text-[#F1B434]" />
                    )}
                  </div>
                  <span className="text-gray-900">Select All</span>
                </button>
                
                <div className="h-px bg-gray-200 my-1" />
              </>
            )}
            
            {locations.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => handleLocationClick(location)}
                className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                  {selectedLocations.includes(location) && (
                    <Check className="h-4 w-4 text-[#F1B434]" />
                  )}
                </div>
                <span className="text-gray-900">{location}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}