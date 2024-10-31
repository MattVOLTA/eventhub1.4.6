import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, List } from 'lucide-react';
import { SearchBar } from './SearchBar';
import logo from '../assets/logo.svg';

interface LayoutProps {
  viewMode?: 'list' | 'calendar';
  onViewModeChange?: (mode: 'list' | 'calendar') => void;
  searchTerm?: string;
  onSearch?: (value: string) => void;
}

export function Layout({ 
  viewMode = 'list', 
  onViewModeChange,
  searchTerm = '',
  onSearch
}: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen relative bg-ocean">
      <header className="fixed top-0 left-0 right-0 z-30">
        <div className="absolute inset-0 bg-ocean bg-opacity-95 backdrop-blur-sm" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-4 min-w-0 z-50 md:relative"
              data-search-hide
            >
              <div className="flex items-end gap-4 min-w-0">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Eventbrite Events" 
                    className="h-8 w-auto object-contain"
                    style={{ marginBottom: '2px' }}
                  />
                </div>
                <span 
                  className="text-white text-xl font-semibold truncate"
                  style={{ lineHeight: '1' }}
                >
                  Event Hub
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {onSearch && <SearchBar value={searchTerm} onChange={onSearch} />}
              
              {onViewModeChange && (
                <button
                  onClick={() => onViewModeChange(viewMode === 'list' ? 'calendar' : 'list')}
                  className="p-2 text-white hover:bg-sky/10 rounded-md transition-colors"
                  title={viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
                >
                  {viewMode === 'list' ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <List className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <Outlet />
      </main>
    </div>
  );
}