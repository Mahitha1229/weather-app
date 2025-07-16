import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { LocationSuggestion } from '../types';
import { API } from '../config/api';

interface SearchBarProps {
  onSearch: (location: LocationSuggestion) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API.geocoding}?name=${encodeURIComponent(value)}&count=10`);
      const data = await response.json();

      if (data.results) {
        const formattedSuggestions: LocationSuggestion[] = data.results.map((result: any) => ({
          name: result.name,
          country: result.country,
          state: result.admin1,
          latitude: result.latitude,
          longitude: result.longitude,
          fullName: [
            result.name,
            result.admin1,
            result.country
          ].filter(Boolean).join(', ')
        }));
        setSuggestions(formattedSuggestions);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.fullName);
    setSuggestions([]);
    setIsOpen(false);
    onSearch(suggestion);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for any city, state, or country..."
          className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-transparent focus:border-white bg-white/20 backdrop-blur-sm text-white placeholder-white/70 outline-none"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="text-gray-900">{suggestion.name}</div>
              <div className="text-sm text-gray-600">
                {[suggestion.state, suggestion.country].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar