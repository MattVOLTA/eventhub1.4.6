import { EventbriteEvent } from '../types';

export function searchEvents(events: EventbriteEvent[], searchTerm: string, getOrganizerName: (eventId: string) => string): EventbriteEvent[] {
  if (!searchTerm.trim()) return events;

  const normalizedSearch = searchTerm.toLowerCase().trim();

  return events.filter(event => {
    const organizerName = getOrganizerName(event.id).toLowerCase();
    const venueName = event.venue?.name?.toLowerCase() || '';
    const venueCity = event.venue?.address?.city?.toLowerCase() || '';
    const eventName = event.name.text.toLowerCase();
    const eventDescription = event.description.text.toLowerCase();

    return (
      eventName.includes(normalizedSearch) ||
      eventDescription.includes(normalizedSearch) ||
      venueName.includes(normalizedSearch) ||
      venueCity.includes(normalizedSearch) ||
      organizerName.includes(normalizedSearch)
    );
  });
}