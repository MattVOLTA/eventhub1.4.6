import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Video, MapPinned } from 'lucide-react';
import { EventbriteEvent } from '../types';
import { EventPopover } from './EventPopover';
import { WeekView } from './WeekView';
import { DayEventsModal } from './DayEventsModal';

interface CalendarViewProps {
  events: EventbriteEvent[];
  getOrganizerName: (eventId: string) => string;
  viewType: 'month' | 'week';
  onViewTypeChange: (type: 'month' | 'week') => void;
}

export function CalendarView({ events, getOrganizerName, viewType, onViewTypeChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<{ date: Date; events: EventbriteEvent[] } | null>(null);

  const today = useMemo(() => new Date(), []);

  const monthYear = useMemo(() => {
    return currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate padding days for the start of the month
    const startPadding = firstDay.getDay();
    
    // Create array of all days in the month plus padding
    const days = [];
    
    // Add padding days at the start
    for (let i = 0; i < startPadding; i++) {
      const paddingDate = new Date(year, month, -startPadding + i + 1);
      days.push({
        date: paddingDate,
        isPadding: true,
        events: []
      });
    }
    
    // Add actual days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start.local);
        return eventDate.getDate() === i &&
               eventDate.getMonth() === month &&
               eventDate.getFullYear() === year;
      });
      
      days.push({
        date,
        isPadding: false,
        events: dayEvents
      });
    }
    
    // Add padding days at the end if needed
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 rows × 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      const paddingDate = new Date(year, month + 1, i);
      days.push({
        date: paddingDate,
        isPadding: true,
        events: []
      });
    }
    
    return days;
  }, [currentDate, events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (date: Date, events: EventbriteEvent[]) => {
    if (events.length > 0) {
      setSelectedDay({ date, events });
    }
  };

  if (viewType === 'week') {
    return (
      <WeekView
        currentDate={currentDate}
        events={events}
        getOrganizerName={getOrganizerName}
        isToday={isToday}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#CF4520]">
                <Video className="w-4 h-4 text-white" />
                <span className="text-white">Virtual</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#5CB8B2]">
                <MapPinned className="w-4 h-4 text-white" />
                <span className="text-white">In-Person</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t">
          {calendarDays.map(({ date, isPadding, events }, index) => {
            const isCurrentDay = isToday(date);
            const hasEvents = events.length > 0;
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] p-2 border-b border-r relative ${
                  isPadding ? 'bg-gray-50' : 'bg-white'
                } ${index % 7 === 0 ? 'border-l' : ''} ${
                  isCurrentDay ? 'ring-2 ring-[#F1B434] ring-inset' : ''
                } ${hasEvents ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => hasEvents && handleDayClick(date, events)}
              >
                <span
                  className={`
                    inline-flex items-center justify-center
                    ${isCurrentDay 
                      ? 'w-7 h-7 rounded-full bg-[#F1B434] text-white font-medium'
                      : isPadding 
                        ? 'text-gray-400' 
                        : 'text-gray-900'
                    }
                  `}
                >
                  {date.getDate()}
                </span>

                <div className="mt-1 space-y-1">
                  {events.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`
                        text-xs px-2 py-1 rounded-md truncate
                        ${event.online_event 
                          ? 'bg-[#CF4520] text-white'
                          : 'bg-[#5CB8B2] text-white'
                        }
                      `}
                    >
                      {event.name.text}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500 pl-2">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <DayEventsModal
          date={selectedDay.date}
          events={selectedDay.events}
          organizerName={getOrganizerName}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}