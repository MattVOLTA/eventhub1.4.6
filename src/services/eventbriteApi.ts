import { config } from '../config';
import { EventbriteEvent } from '../types';
import { organizations } from '../data/organizations';

export class EventbriteApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'EventbriteApiError';
  }
}

async function fetchWithTimeout<T>(url: string, options: RequestInit = {}, timeout = 10000): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new EventbriteApiError(response.status, 'Invalid or expired API token');
      }
      if (response.status === 404) {
        throw new EventbriteApiError(response.status, 'Organization or events not found');
      }
      if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        throw new EventbriteApiError(
          response.status,
          'Invalid request parameters',
          errorData?.error_description
        );
      }
      if (response.status >= 500) {
        throw new EventbriteApiError(
          response.status,
          'Eventbrite service is temporarily unavailable',
          'Please try again later'
        );
      }

      throw new EventbriteApiError(
        response.status,
        'Failed to fetch events',
        await response.text()
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof EventbriteApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new EventbriteApiError(
        408,
        'Request timeout',
        'The request took too long to complete'
      );
    }
    if (!navigator.onLine) {
      throw new EventbriteApiError(
        0,
        'No internet connection',
        'Please check your internet connection and try again'
      );
    }
    throw new EventbriteApiError(
      0,
      'Network error or service unavailable',
      error.message || 'Failed to fetch'
    );
  } finally {
    clearTimeout(id);
  }
}

async function fetchEventbrite<T>(endpoint: string): Promise<T> {
  const url = `${config.apiBase}${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${config.token}`;
  return fetchWithTimeout<T>(url);
}

async function tryFetchEvents(id: string): Promise<EventbriteEvent[]> {
  // Get current date and date 6 months from now
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  
  // Format dates to match Eventbrite's expected format (ISO 8601)
  const startDate = now.toISOString().split('.')[0] + 'Z';
  const endDate = sixMonthsFromNow.toISOString().split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    status: 'live',
    order_by: 'start_asc',
    'start_date.range_start': startDate,
    'start_date.range_end': endDate,
    expand: 'venue,organizer'
  });

  // Try organization endpoint first
  try {
    const response = await fetchEventbrite<{ events: EventbriteEvent[] }>(
      `/organizations/${id}/events/?${params}`
    );
    return response.events;
  } catch (error) {
    if (error instanceof EventbriteApiError && error.status === 404) {
      // If organization not found, try organizer endpoint
      try {
        const response = await fetchEventbrite<{ events: EventbriteEvent[] }>(
          `/organizers/${id}/events/?${params}`
        );
        return response.events;
      } catch (innerError) {
        throw innerError;
      }
    }
    throw error;
  }
}

export async function getOrganizerEvents(organizerId: string): Promise<EventbriteEvent[]> {
  if (!organizerId?.trim()) {
    throw new EventbriteApiError(400, 'Organizer ID is required');
  }

  try {
    const events = await tryFetchEvents(organizerId);
    return events
      .filter(event => event.status === 'live' && event.listed !== false)
      .sort((a, b) => new Date(a.start.utc).getTime() - new Date(b.start.utc).getTime());
  } catch (error) {
    console.error('Error fetching events for organizer:', {
      organizerId,
      error: {
        message: error instanceof EventbriteApiError ? error.message : 'Unknown error',
        details: error instanceof EventbriteApiError ? error.details : error.message
      }
    });
    throw error;
  }
}

export async function getAllEvents(): Promise<EventbriteEvent[]> {
  // Load events in parallel with error handling
  const eventPromises = organizations.map(org => 
    getOrganizerEvents(org.id)
      .catch(error => {
        console.error('Error fetching events for organizer:', {
          organizerId: org.id,
          error: {
            message: error instanceof EventbriteApiError ? error.message : 'Unknown error',
            details: error instanceof EventbriteApiError ? error.details : error.message
          }
        });
        return [];
      })
  );
  
  const results = await Promise.all(eventPromises);
  
  // Combine and sort all events
  return results
    .flat()
    .sort((a, b) => new Date(a.start.utc).getTime() - new Date(b.start.utc).getTime());
}