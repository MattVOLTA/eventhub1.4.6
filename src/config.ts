interface OrganizerConfig {
  id: string;
  name: string;
}

export const EVENTBRITE_TOKEN = import.meta.env.VITE_EVENTBRITE_TOKEN;
export const EVENTBRITE_API_BASE = 'https://www.eventbriteapi.com/v3';
export const DEFAULT_ORGANIZERS: OrganizerConfig[] = JSON.parse(import.meta.env.VITE_DEFAULT_ORGANIZERS || '[]');

export interface EventbriteConfig {
  token: string;
  apiBase: string;
}

export const config: EventbriteConfig = {
  token: EVENTBRITE_TOKEN,
  apiBase: EVENTBRITE_API_BASE,
};