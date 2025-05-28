import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
// import { searchSymbols } from '../services/mockData'; // <-- REMOVE THIS IMPORT
import { MarketType } from '../types';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  market: MarketType;
}

interface SearchResult {
  symbol: string;
  description: string; // Backend returns 'description', not 'name'
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, market }) => {
  const [query, setQuery] = useState(''); // User's input in the search bar
  const [results, setResults] = useState<SearchResult[]>([]); // Search suggestions from backend
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For debouncing API calls

  // Define your backend API URL once
  const backendApiUrl = 'https://market-oracle-backend.onrender.com';

  // Effect to fetch suggestions from the backend with debounce
  useEffect(() => {
    // Clear any existing timeout to reset the debounce timer
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is empty, clear results and hide dropdown
    if (query.trim() === '') {
      setResults([]);
      setIsDropdownVisible(false);
      return;
    }

    // Set a new timeout to make the API call after a delay
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        console.log(`Fetching search results for: ${query}`); // Log for debugging
        const response = await fetch(`${backendApiUrl}/api/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && Array.isArray(data.results)) {
          // Filter results based on selected market
          const filteredResults = data.results.filter((item: SearchResult) => {
            const symbolUpper = item.symbol.toUpperCase();
            const descriptionUpper = item.description.toUpperCase();

            if (market === 'US') {
              // Basic filter for US: exclude symbols with specific suffixes often seen in non-US listings
              // This is a heuristic; more robust filtering might need exchange codes from API
              return !symbolUpper.includes('.') || 
                     symbolUpper.endsWith('.US') || symbolUpper.endsWith('.NYSE') || symbolUpper.endsWith('.NASDAQ') || symbolUpper.endsWith('.NAS');
            } else if (market === 'India') {
              // Basic filter for India: look for common Indian exchange suffixes or company name indicators
              return symbolUpper.endsWith('.NS') || symbolUpper.endsWith('.BO') || 
                     descriptionUpper.includes('LTD') || descriptionUpper.includes('INDIA');
            }
            return true; // If market is neither US nor India, or no specific filter needed
          });

          setResults(filteredResults);
          // Show dropdown only if there are results after filtering
          setIsDropdownVisible(filteredResults.length > 0);
        } else {
          setResults([]);
          setIsDropdownVisible(false);
        }
      } catch (e) {
        console.error("Error fetching search suggestions:", e);
        setResults([]);
        setIsDropdownVisible(false);
      }
    }, 300); // 300ms debounce delay

    // Cleanup function for the useEffect
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, backendApiUrl, market]); // Dependencies: re-run when query, backendApiUrl, or market changes

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
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
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission
    if (query.trim()) { // Only search if query is not empty
      onSearch(query.toUpperCase()); // Pass uppercase symbol to parent
      setIsDropdownVisible(false); // Hide dropdown after search
    }
  };

  const handleSelectSymbol = (symbol: string) => {
    setQuery(symbol); // Update input field with selected symbol
    onSearch(symbol);  // Trigger search for the selected symbol in parent
    setIsDropdownVisible(false); // Hide dropdown
  };

  const handleFocus = () => {
    // Show dropdown if there's a query and results, or if input is empty (to show popular, though we removed mock data)
    // For now, only show if query is not empty and we have suggestions
    if (query.trim() !== '' && results.length > 0) {
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
              onClick={() => {
                setQuery('');
                setResults([]); // Clear results when clearing query
                setIsDropdownVisible(false);
              }}
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
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto" // Added max-height and overflow
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
                    {/* Display 'description' from backend, which is the company name */}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{item.description}</span> 
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
