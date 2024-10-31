import { useMemo, useState, useEffect } from 'react';
import { EventbriteEvent } from '../types';
import { EventPopover } from './EventPopover';
import { formatTime } from '../utils/dateUtils';
import { MapPin, Video, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  events: EventbriteEvent[];
  getOrganizerName: (eventId: string) => string;
  isToday: (date: Date) => boolean;
}

export function WeekView({ currentDate, events, getOrganizerName, isToday }: WeekViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentDate);
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 765);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 765);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start.local);
        return eventDate.getFullYear() === date.getFullYear() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getDate() === date.getDate();
      }).sort((a, b) => 
        new Date(a.start.local).getTime() - new Date(b.start.local).getTime()
      );

      days.push({
        date,
        events: dayEvents,
        isCurrentMonth: date.getMonth() === currentDate.getMonth()
      });
    }
    return days;
  }, [selectedWeek, events, currentDate]);

  const visibleDays = useMemo(() => {
    if (!isMobile) return weekDays;
    return weekDays.slice(startDayIndex, startDayIndex + 3);
  }, [weekDays, startDayIndex, isMobile]);

  const weekTitle = useMemo(() => {
    const startDate = visibleDays[0].date;
    const endDate = visibleDays[visibleDays.length - 1].date;
    
    const formatDate = (date: Date) => {
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [visibleDays]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (isMobile) {
      if (direction === 'prev') {
        if (startDayIndex === 0) {
          setSelectedWeek(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
          });
          setStartDayIndex(4);
        } else {
          setStartDayIndex(prev => Math.max(0, prev - 3));
        }
      } else {
        if (startDayIndex >= 4) {
          setSelectedWeek(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
          });
          setStartDayIndex(0);
        } else {
          setStartDayIndex(prev => Math.min(4, prev + 3));
        }
      }
    } else {
      setSelectedWeek(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 7);
        } else {
          newDate.setDate(prev.getDate() + 7);
        }
        return newDate;
      });
    }
  };

  const getEventDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
      return `${diffMinutes} min`;
    }
    
    return `${Math.round(diffHours * 10) / 10}h`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{weekTitle}</h2>
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-7 bg-gray-50 border-b">
        {visibleDays.map(({ date }) => {
          const dayName = date.toLocaleDateString('default', { weekday: 'short' });
          const dayNumber = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          return (
            <div key={`header-${date.toISOString()}`} className="py-2 text-center">
              <div className="text-sm font-medium text-gray-700">{dayName}</div>
              <div className="text-xs text-gray-500">{`${month} ${dayNumber}`}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-7 border-t">
        {visibleDays.map(({ date, events: dayEvents, isCurrentMonth }, index) => {
          const isCurrentDay = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[600px] border-r border-b ${
                index === 0 ? 'border-l' : ''
              } ${
                isCurrentDay 
                  ? 'bg-yellow-50' 
                  : isCurrentMonth 
                    ? 'bg-white' 
                    : 'bg-gray-50'
              }`}
            >
              <div className="p-2 space-y-2">
                {dayEvents.map(event => {
                  const startTime = formatTime(event.start.local);
                  const duration = getEventDuration(event.start.local, event.end.local);
                  const organizerName = getOrganizerName(event.id);

                  return (
                    <EventPopover
                      key={event.id}
                      event={event}
                      organizerName={organizerName}
                    >
                      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="p-3">
                          <h3 className="font-medium mb-2 line-clamp-2 text-sm text-gray-900">
                            {event.name.text}
                          </h3>

                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>{startTime} · {duration}</span>
                            </div>

                            {!event.online_event && event.venue?.name && (
                              <div className="flex items-center text-xs text-gray-600">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{event.venue.name}</span>
                              </div>
                            )}

                            <div className="flex items-center text-xs text-gray-600">
                              <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{organizerName}</span>
                            </div>
                          </div>

                          {event.description.text && (
                            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                              {event.description.text}
                            </p>
                          )}
                        </div>

                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                          {event.online_event ? (
                            <Video className="w-4 h-4 text-blue-600" />
                          ) : (
                            <MapPin className="w-4 h-4 text-green-600" />
                          )}
                          
                          <span className={`text-xs font-medium ${
                            event.is_free 
                              ? 'text-purple-600' 
                              : 'text-amber-600'
                          }`}>
                            {event.is_free ? 'Free' : '$'}
                          </span>
                        </div>
                      </div>
                    </EventPopover>
                  );
                })}

                {dayEvents.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}