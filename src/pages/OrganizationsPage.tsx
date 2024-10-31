import { useState } from 'react';
import { organizations } from '../data/organizations';
import type { Organization } from '../data/organizations';

export function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1B434] focus:border-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="px-6 py-4 hover:bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
              <p className="text-sm text-gray-500">ID: {org.id}</p>
            </div>
          ))}

          {filteredOrganizations.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No organizations found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}