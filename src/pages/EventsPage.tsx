import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { CalendarView } from '../components/CalendarView';
import { OrgFilter } from '../components/OrgFilter';
import { LocationFilter } from '../components/LocationFilter';
import { EventTypeFilter } from '../components/EventTypeFilter';
import { getAllEvents } from '../services/eventbriteApi';
import type { EventbriteEvent, OrganizerConfig } from '../types';

const ORGANIZATIONS: OrganizerConfig[] = [
  { id: '16982059077', name: 'ACENET' },
  { id: '1170751291', name: 'Boundless Accelerator' },
  { id: '17798675657', name: 'CEED' },
  { id: '17248940259', name: 'COVE' },
  { id: '54805067693', name: 'Dal Innovates' },
  { id: '28571197123', name: 'Emera ideaHUB' },
  { id: '17743415525', name: 'IGNITE' },
  { id: '30295870918', name: 'Invest Nova Scotia' },
  { id: '18504351047', name: 'Mashup Lab' },
  { id: '69049022273', name: 'Nova Scotia Health Innovation Hub' },
  { id: '29691516847', name: 'Ocean Startup Project' },
  { id: '5809505854', name: 'Planet Hatch' },
  { id: '90150697203', name: 'Spinnaker Sales Group' },
  { id: '70710753533', name: 'Springboard Atlantic' },
  { id: '51349688173', name: 'Tribe Network' },
  { id: '74023149123', name: 'Venn Innovation' },
  { id: '3570959959', name: 'Volta' }
];

interface EventsPageProps {
  viewMode: 'list' | 'calendar';
  searchTerm: string;
  calendarType: 'month' | 'week';
  onCalendarTypeChange: (type: 'month' | 'week') => void;
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
  eventFilter: 'all' | 'virtual' | 'in-person';
  onEventFilterChange: (filter: 'all' | 'virtual' | 'in-person') => void;
}

export function EventsPage({ 
  viewMode, 
  searchTerm,
  calendarType,
  onCalendarTypeChange,
  selectedLocations,
  onLocationChange,
  eventFilter,
  onEventFilterChange
}: EventsPageProps) {
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(ORGANIZATIONS.map(org => org.id));
  const [selectedEventTypes, setSelectedEventTypes] = useState<('virtual' | 'in-person')[]>(['virtual', 'in-person']);

  const eventCounts = useMemo(() => {
    const filteredByOrg = events.filter(event => selectedOrgs.includes(event.organizer_id));
    const filteredByLocation = filteredByOrg.filter(event => {
      if (event.online_event) return true;
      if (!event.venue?.address?.city) return false;
      return selectedLocations.includes(event.venue.address.city);
    });

    return {
      virtual: filteredByLocation.filter(event => event.online_event).length,
      inPerson: filteredByLocation.filter(event => !event.online_event).length
    };
  }, [events, selectedOrgs, selectedLocations]);

  const locations = useMemo(() => {
    return [...new Set(events
      .filter(event => !event.online_event && event.venue?.address?.city)
      .map(event => event.venue!.address.city)
    )].sort();
  }, [events]);

  useEffect(() => {
    async function loadData() {
      try {
        if (ORGANIZATIONS.length === 0) {
          setLoading(false);
          return;
        }

        const allEvents = await getAllEvents(ORGANIZATIONS.map(org => org.id));
        setEvents(allEvents);
        setError(null);

        const initialLocations = [...new Set(allEvents
          .filter(event => !event.online_event && event.venue?.address?.city)
          .map(event => event.venue!.address.city)
        )];
        onLocationChange(initialLocations);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [onLocationChange]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    const loadData = async () => {
      try {
        const allEvents = await getAllEvents(ORGANIZATIONS.map(org => org.id));
        setEvents(allEvents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  const getOrganizerName = (eventId: string) => {
    const organizer = ORGANIZATIONS.find(org => 
      events.find(event => event.id === eventId)?.organizer_id === org.id
    );
    return organizer?.name || 'Unknown Organization';
  };

  const filteredEvents = events
    .filter(event => selectedOrgs.includes(event.organizer_id))
    .filter(event => {
      if (event.online_event) {
        return selectedEventTypes.includes('virtual');
      } else {
        return selectedEventTypes.includes('in-person');
      }
    })
    .filter(event => {
      if (event.online_event) return true;
      if (!event.venue?.address?.city) return false;
      return selectedLocations.includes(event.venue.address.city);
    })
    .filter(event => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        event.name.text.toLowerCase().includes(searchLower) ||
        event.description.text.toLowerCase().includes(searchLower) ||
        (event.venue?.name?.toLowerCase().includes(searchLower)) ||
        (event.venue?.address?.city?.toLowerCase().includes(searchLower))
      );
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-72">
            <OrgFilter
              organizers={ORGANIZATIONS}
              selectedOrgs={selectedOrgs}
              onChange={setSelectedOrgs}
            />
          </div>
          {locations.length > 0 && (
            <div className="w-full sm:w-72">
              <LocationFilter
                locations={locations}
                selectedLocations={selectedLocations}
                onChange={onLocationChange}
              />
            </div>
          )}
          <div className="w-full sm:w-72">
            <EventTypeFilter
              selectedTypes={selectedEventTypes}
              onChange={setSelectedEventTypes}
              virtualCount={eventCounts.virtual}
              inPersonCount={eventCounts.inPerson}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-white" />
          <p className="mt-4 text-white">Loading events...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center px-3 py-1 text-sm text-red-700 hover:bg-red-100 rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </button>
          </div>
        </div>
      ) : !ORGANIZATIONS.length ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg shadow">
          <p className="text-white">No organizations configured. Please add organizations to continue.</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                organizerName={getOrganizerName(event.id)}
              />
            ))}
          </div>
        ) : (
          <CalendarView 
            events={filteredEvents}
            getOrganizerName={getOrganizerName}
            viewType={calendarType}
            onViewTypeChange={onCalendarTypeChange}
          />
        )
      ) : (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg shadow">
          <p className="text-white">No events found matching your criteria</p>
        </div>
      )}
    </div>
  );
}