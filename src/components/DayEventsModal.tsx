import { X, Calendar, Clock, MapPin, Globe2, Video, MapPinned, Ticket } from 'lucide-react';
import { EventbriteEvent } from '../types';
import { formatTime } from '../utils/dateUtils';

interface DayEventsModalProps {
  date: Date;
  events: EventbriteEvent[];
  organizerName: (eventId: string) => string;
  onClose: () => void;
}

export function DayEventsModal({ date, events, organizerName, onClose }: DayEventsModalProps) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 isolate z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl my-8">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-sky bg-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-kitchen" />
                <h2 className="text-xl font-semibold text-neutral">{formattedDate}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral/40 hover:text-neutral/50 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-sky rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-neutral">
                            {event.name.text}
                          </h3>
                          <div className="flex items-center text-sm text-neutral/70">
                            <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            {formatTime(event.start.local)} - {formatTime(event.end.local)}
                          </div>
                          {!event.online_event && event.venue && (
                            <div className="flex items-center text-sm text-neutral/70">
                              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                              <span>{event.venue.name}</span>
                            </div>
                          )}
                          {event.online_event && (
                            <div className="flex items-center text-sm text-neutral/70">
                              <Globe2 className="h-4 w-4 mr-1.5 flex-shrink-0" />
                              <span>Virtual Event</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-neutral/70">
                            <Ticket className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>{event.is_free ? 'Free Event' : 'Paid Event'}</span>
                          </div>
                        </div>

                        <div className={`
                          flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${event.online_event 
                            ? 'bg-rock text-white' 
                            : 'bg-fish text-white'
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

                      {event.description.text && (
                        <p className="mt-2 text-sm text-neutral/70 line-clamp-2">
                          {event.description.text}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-neutral/50">
                          Organized by {organizerName(event.id)}
                        </span>
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-kitchen hover:bg-kitchen-hover rounded-md transition-colors"
                        >
                          {event.is_free ? 'Register' : 'Get Tickets'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="text-center py-8 text-neutral/50">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}