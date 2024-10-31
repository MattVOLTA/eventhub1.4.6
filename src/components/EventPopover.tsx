import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, Globe2, Video, MapPinned, X } from 'lucide-react';
import { EventbriteEvent } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';

interface EventPopoverProps {
  event: EventbriteEvent;
  organizerName: string;
  children: React.ReactNode;
}

export function EventPopover({ event, organizerName, children }: EventPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div
            ref={popoverRef}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 pr-8">{event.name.text}</h3>
              
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDate(event.start.local)}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatTime(event.start.local)} - {formatTime(event.end.local)}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  {event.online_event ? (
                    <>
                      <Globe2 className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Virtual Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {event.venue?.name && (
                          <span className="font-medium">{event.venue.name}</span>
                        )}
                        {event.venue?.address && (
                          <span className="block text-xs text-gray-500">
                            {event.venue.address.localized_address_display}
                          </span>
                        )}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Ticket className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{event.is_free ? 'Free Event' : 'Paid Event'}</span>
                </div>

                {event.description.text && (
                  <div className="mt-4 text-gray-600">
                    <p className="line-clamp-3">{event.description.text}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Organized by {organizerName}
                  </p>
                  <div className={`
                    flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                    ${event.online_event 
                      ? 'bg-[#CF4520] text-white' 
                      : 'bg-[#5CB8B2] text-white'
                    }
                  `}>
                    {event.online_event ? (
                      <>
                        <Video className="w-3 h-3" />
                        <span>Virtual</span>
                      </>
                    ) : (
                      <>
                        <MapPinned className="w-3 h-3" />
                        <span>In-Person</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full text-center bg-[#F1B434] text-white px-4 py-2 rounded-md hover:bg-[#d99b1d] transition-colors text-sm font-medium"
              >
                {event.is_free ? 'Register Now' : 'Get Tickets'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}