import { useLocalStorage } from './hooks/useLocalStorage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EventsPage } from './pages/EventsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';

export function App() {
  const [viewMode, setViewMode] = useLocalStorage<'list' | 'calendar'>('viewMode', 'list');
  const [calendarType, setCalendarType] = useLocalStorage<'month' | 'week'>('calendarType', 'month');
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('searchTerm', '');
  const [selectedLocations, setSelectedLocations] = useLocalStorage<string[]>('selectedLocations', []);
  const [eventFilter, setEventFilter] = useLocalStorage<'all' | 'virtual' | 'in-person'>('eventFilter', 'all');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout 
              viewMode={viewMode} 
              onViewModeChange={setViewMode}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          }
        >
          <Route 
            index 
            element={
              <EventsPage 
                viewMode={viewMode} 
                searchTerm={searchTerm}
                calendarType={calendarType}
                onCalendarTypeChange={setCalendarType}
                selectedLocations={selectedLocations}
                onLocationChange={setSelectedLocations}
                eventFilter={eventFilter}
                onEventFilterChange={setEventFilter}
              />
            } 
          />
          <Route path="organizations" element={<OrganizationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}