import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { OrganizerConfig } from '../types';

interface OrgFilterProps {
  organizers: OrganizerConfig[];
  selectedOrgs: string[];
  onChange: (selectedIds: string[]) => void;
}

export function OrgFilter({ organizers, selectedOrgs, onChange }: OrgFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const validOrganizers = organizers.filter(org => org.id);

  const handleOrgClick = (id: string) => {
    if (!id) return;
    const newSelection = selectedOrgs.includes(id)
      ? selectedOrgs.filter(orgId => orgId !== id)
      : [...selectedOrgs, id];
    onChange(newSelection);
  };

  const handleSelectAllClick = () => {
    const allSelected = selectedOrgs.length === validOrganizers.length;
    onChange(allSelected ? [] : validOrganizers.map(org => org.id));
  };

  const getButtonText = () => {
    if (selectedOrgs.length === 0) return 'No Organizations Selected';
    if (selectedOrgs.length === validOrganizers.length) return 'All Organizations';
    return `${selectedOrgs.length} Organization${selectedOrgs.length === 1 ? '' : 's'}`;
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
            {validOrganizers.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleSelectAllClick}
                  className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                    {selectedOrgs.length === validOrganizers.length && (
                      <Check className="h-4 w-4 text-[#F1B434]" />
                    )}
                  </div>
                  <span className="text-gray-900 text-left">Select All</span>
                </button>
                
                <div className="h-px bg-gray-200 my-1" />
              </>
            )}
            
            {validOrganizers.map((org) => (
              <button
                key={org.id || `org-${org.airtableId}`}
                type="button"
                onClick={() => org.id && handleOrgClick(org.id)}
                className="w-full px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                  {selectedOrgs.includes(org.id) && (
                    <Check className="h-4 w-4 text-[#F1B434]" />
                  )}
                </div>
                <span className="text-gray-900 text-left">{org.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}