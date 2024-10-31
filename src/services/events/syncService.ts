import { insertEvent, getExistingEventIds } from '../airtable/eventsService';
import type { EventbriteEvent } from '../../types';

interface SyncResult {
  added: number;
  skipped: number;
  failed: number;
  errors: Array<{ eventId: string; error: string }>;
}

export async function syncEvents(
  events: EventbriteEvent[],
  getOrganizerName: (eventId: string) => string
): Promise<SyncResult> {
  const result: SyncResult = {
    added: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };
  
  try {
    // Get existing event IDs from Airtable
    const existingIds = await getExistingEventIds();

    // Process each event
    for (const event of events) {
      try {
        // Skip if event already exists
        if (existingIds.has(event.id)) {
          result.skipped++;
          continue;
        }

        // Insert new event
        const organizerName = getOrganizerName(event.id);
        const success = await insertEvent(event, organizerName);

        if (success) {
          result.added++;
        } else {
          result.failed++;
          result.errors.push({
            eventId: event.id,
            error: 'Failed to insert event'
          });
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          eventId: event.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  } catch (error) {
    console.error('Event sync failed:', error);
    throw error;
  }

  return result;
}