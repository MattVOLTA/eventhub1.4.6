import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

type EventType = 'virtual' | 'in-person';

interface EventTypeFilterProps {
  selectedTypes: EventType[];
  onChange: (selectedTypes: EventType[]) => void;
  virtualCount: number;
  inPersonCount: number;
}

export function EventTypeFilter({ selectedTypes, onChange, virtualCount, inPersonCount }: EventTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const eventTypes: { id: EventType; label: string; count: number }[] = [
    { id: 'virtual', label: 'Virtual', count: virtualCount },
    { id: 'in-person', label: 'In-Person', count: inPersonCount },
  ];

  const handleTypeClick = (type: EventType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleSelectAllClick = () => {
    const allSelected = selectedTypes.length === eventTypes.length;
    onChange(allSelected ? [] : eventTypes.map(type => type.id));
  };

  const getButtonText = () => {
    if (selectedTypes.length === 0) return 'No Event Types Selected';
    if (selectedTypes.length === eventTypes.length) return 'All Event Types';
    return `${selectedTypes.length} Event Type${selectedTypes.length === 1 ? '' : 's'}`;
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
            <button
              type="button"
              onClick={handleSelectAllClick}
              className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                {selectedTypes.length === eventTypes.length && (
                  <Check className="h-4 w-4 text-[#F1B434]" />
                )}
              </div>
              <span className="text-gray-900">Select All</span>
            </button>
            
            <div className="h-px bg-gray-200 my-1" />
            
            {eventTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeClick(type.id)}
                className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                    {selectedTypes.includes(type.id) && (
                      <Check className="h-4 w-4 text-[#F1B434]" />
                    )}
                  </div>
                  <span className="text-gray-900">{type.label}</span>
                </div>
                <span className="text-sm text-gray-500">({type.count})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}