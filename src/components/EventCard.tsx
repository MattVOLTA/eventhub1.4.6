import { Calendar, Clock, MapPin, Ticket, Globe2, Video, MapPinned } from 'lucide-react';
import { EventbriteEvent } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';

interface EventCardProps {
  event: EventbriteEvent;
  organizerName: string;
}

export function EventCard({ event, organizerName }: EventCardProps) {
  const getLocationDisplay = () => {
    if (event.online_event) {
      return 'Join online from anywhere';
    }
    if (event.venue?.address) {
      return event.venue.address.localized_area_display;
    }
    return 'Venue details on Eventbrite';
  };

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full"
    >
      {event.logo?.url ? (
        <div className="relative h-48">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <img
            src={event.logo.url}
            alt={event.name.text}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#004851] to-[#00687a] flex items-center justify-center">
          <div className="text-white/80">
            {event.online_event ? (
              <Video className="w-12 h-12" />
            ) : (
              <MapPinned className="w-12 h-12" />
            )}
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow space-y-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {event.name.text}
          </h3>
          <p className="text-gray-600 line-clamp-2">
            {event.description.text}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <span>{formatDate(event.start.local)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <span>{formatTime(event.start.local)} - {formatTime(event.end.local)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              {event.online_event ? (
                <>
                  <Globe2 className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Join online from anywhere</span>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <span>
                    {event.venue?.name && (
                      <span className="font-medium">{event.venue.name}</span>
                    )}
                    {event.venue?.address && (
                      <span className="block text-sm text-gray-500">
                        {event.venue.address.localized_address_display}
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center text-gray-700">
              <Ticket className="w-5 h-5 mr-2 text-gray-500" />
              <span>{event.is_free ? 'Free Event' : 'Paid Event'}</span>
            </div>
          </div>
        </div>

        <button
          className="mt-6 mb-4 inline-flex items-center justify-center w-full bg-[#F1B434] text-white px-6 py-2.5 rounded-md hover:bg-[#d99b1d] transition-colors font-medium"
        >
          {event.is_free ? 'Register Now' : 'Get Tickets'}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 truncate pr-2 flex-1">
              Organized by {organizerName}
            </p>
            <div className={`
              flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
              ${event.online_event 
                ? 'bg-[#CF4520] text-white' 
                : 'bg-[#5CB8B2] text-white'
              }
            `}>
              {event.online_event ? (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Virtual</span>
                </>
              ) : (
                <>
                  <MapPinned className="w-3.5 h-3.5" />
                  <span>In-Person</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}