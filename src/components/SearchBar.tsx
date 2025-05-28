import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchSymbols } from '../services/mockData';
import { MarketType } from '../types';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  market: MarketType;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, market }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Search for symbols when query changes
    if (query.length > 0) {
      const searchResults = searchSymbols(query, market);
      setResults(searchResults);
      setIsDropdownVisible(true);
    } else {
      // Show popular suggestions when empty
      setResults(searchSymbols('', market));
      setIsDropdownVisible(false);
    }
  }, [query, market]);

  useEffect(() => {
    // Handle clicks outside the dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
      setIsDropdownVisible(false);
    }
  };

  const handleSelectSymbol = (symbol: string) => {
    setQuery(symbol);
    onSearch(symbol);
    setIsDropdownVisible(false);
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-gray-100"
            placeholder="Search for a stock or crypto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setQuery('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown for search results */}
      {isDropdownVisible && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
        >
          <ul className="py-1">
            {results.length > 0 ? (
              results.map((item) => (
                <li key={item.symbol}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => handleSelectSymbol(item.symbol)}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.symbol}</span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{item.name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;