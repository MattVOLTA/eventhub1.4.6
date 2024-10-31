import type { OrganizerConfig } from '../../types';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error('Missing required Airtable environment variables');
}

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

export class AirtableError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AirtableError';
  }
}

// Organization Methods
export async function getOrganizers(): Promise<OrganizerConfig[]> {
  try {
    const response = await fetch(`${API_URL}/Organizations`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records
      .map(record => ({
        id: record.fields.ID?.toString() || '',
        name: record.fields.Name?.toString() || '',
        airtableId: record.id
      }))
      .filter(org => org.id && org.name);
  } catch (error) {
    console.error('Error fetching organizers:', error);
    return [];
  }
}

export async function addOrganizer(organizer: Omit<OrganizerConfig, 'airtableId'>): Promise<OrganizerConfig | null> {
  try {
    const response = await fetch(`${API_URL}/Organizations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Name: organizer.name,
            ID: organizer.id
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add organizer: ${response.status}`);
    }

    const result = await response.json();
    const record = result.records[0];

    return {
      id: record.fields.ID?.toString() || '',
      name: record.fields.Name?.toString() || '',
      airtableId: record.id
    };
  } catch (error) {
    console.error('Error adding organizer:', error);
    return null;
  }
}

export async function deleteOrganizer(airtableId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/Organizations/${airtableId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting organizer:', error);
    return false;
  }
}