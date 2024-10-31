import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { OrganizerConfig } from '../types';

interface OrganizerSelectProps {
  selectedOrganizer: string;
  onSelect: (organizerId: string) => void;
}

export function OrganizerSelect({ selectedOrganizer, onSelect }: OrganizerSelectProps) {
  const [organizers, setOrganizers] = useState<OrganizerConfig[]>(() => {
    const saved = localStorage.getItem('eventbrite-organizers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({ name: '', id: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrganizer.name && newOrganizer.id) {
      const updated = [...organizers, newOrganizer];
      setOrganizers(updated);
      localStorage.setItem('eventbrite-organizers', JSON.stringify(updated));
      setNewOrganizer({ name: '', id: '' });
      setShowForm(false);
      onSelect('all');
    }
  };

  const handleRemove = (id: string) => {
    const updated = organizers.filter(org => org.id !== id);
    setOrganizers(updated);
    localStorage.setItem('eventbrite-organizers', JSON.stringify(updated));
    if (selectedOrganizer === id) {
      onSelect('all');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <select
          value={selectedOrganizer}
          onChange={(e) => onSelect(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/90 text-gray-900"
        >
          <option value="all">All Organizations</option>
          {organizers.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowForm(false)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 sm:mx-auto">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setShowForm(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Add New Organizer
                </h3>
                
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Organizer Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newOrganizer.name}
                      onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Tech Conference Group"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                      Organizer ID
                    </label>
                    <input
                      type="text"
                      id="id"
                      value={newOrganizer.id}
                      onChange={(e) => setNewOrganizer({ ...newOrganizer, id: e.target.value })}
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., 123456789"
                      required
                    />
                  </div>

                  {organizers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Organizers</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="divide-y divide-gray-200">
                          {organizers.map((org) => (
                            <li key={org.id} className="py-4 flex justify-between items-center">
                              <span className="text-gray-900 font-medium">{org.name}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-500">ID: {org.id}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(org.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-end gap-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save Organizer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}