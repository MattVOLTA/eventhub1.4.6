export interface OrganizerConfig {
  id: string;
  name: string;
  airtableId?: string;
}

export interface EventbriteVenue {
  id: string;
  name: string;
  address: {
    address_1: string;
    address_2: string | null;
    city: string;
    region: string;
    postal_code: string;
    country: string;
    localized_address_display: string;
    localized_area_display: string;
  };
  latitude: string;
  longitude: string;
}

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  url: string;
  venue_id: string;
  status: string;
  currency?: string;
  listed: boolean;
  is_free: boolean;
  online_event: boolean;
  organizer_id: string;
  created: string;
  changed: string;
  published: string;
  hide_start_date?: boolean;
  hide_end_date?: boolean;
  organizer: {
    id: string;
    name: string;
    description: {
      text: string;
      html: string;
    };
    logo_id: string | null;
    logo: {
      id: string;
      url: string;
      crop_mask: any;
      original: {
        url: string;
        width: number;
        height: number;
      };
    } | null;
  };
  logo?: {
    url: string;
  };
  venue?: EventbriteVenue;
}