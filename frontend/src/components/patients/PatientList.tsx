import EmptyState from '@components/patients/ui/EmptyState';
import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import NoResultsState from '@components/patients/ui/NoResultsState';
import PatientTable from '@components/patients/ui/PatientTable';
import ThemeToggle from '@components/ui/ThemeToggle';
import { usePatients } from '@queries/patient';
import { useState, useMemo, useEffect, useRef } from 'react';

const PatientList = () => {
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use React Query to fetch patients data
  const { data, isLoading, isError, error, refetch } = usePatients(
    searchQuery ? { name: searchQuery, limit: 10 } : undefined
  );

  const handleSearch = () => {
    setIsSearching(true);
    setSearchQuery(searchName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchQuery('');
    setIsSearching(false);
    // Focus the search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Auto-focus the search input on initial render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Reset search animation state after animation completes
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSearching]);

  // Memoize filtered patients to avoid unnecessary recalculations
  const filteredPatients = useMemo(() => {
    return data?.patients
      ? data.patients.filter((patient) =>
          patient.full_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  }, [data?.patients, searchQuery]);

  // Determine the content to display based on state
  const renderContent = () => {
    // Loading state
    if (isLoading) return <LoadingState />;

    // Error state
    if (isError) {
      return (
        <ErrorState
          message={`Failed to load patients: ${error instanceof Error ? error.message : 'Unknown error'}`}
          onRetry={() => refetch()}
        />
      );
    }

    // Empty initial state (no patients in the system)
    if (!data || !data.patients || data.patients.length === 0) return <EmptyState />;

    // No patients match search criteria
    if (filteredPatients.length === 0) {
      return <NoResultsState searchQuery={searchQuery} onClearSearch={handleClearSearch} />;
    }

    // Display patient table
    return <PatientTable patients={filteredPatients} totalCount={data.patients.length} />;
  };

  return (
    <div className="w-full overflow-hidden transition-colors duration-200">
      <div className="mb-6 p-8 bg-white dark:bg-secondary-800 rounded-xl shadow-md transition-all animate-fade-in border border-secondary-200 dark:border-secondary-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Patient List
          </h2>
          <ThemeToggle />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-secondary-400 group-hover:text-primary-500 transition-colors"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search patients by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`pl-11 pr-12 py-3 w-full text-secondary-900 dark:text-white bg-secondary-50 dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
                isSearching ? 'animate-pulse-custom' : ''
              }`}
              aria-label="Search patients"
            />
            {searchName && (
              <button
                onClick={() => setSearchName('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 focus:outline-none"
                aria-label="Clear search input"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform hover:scale-110"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 font-medium rounded-lg border border-secondary-200 dark:border-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all focus:outline-none focus:ring-2 focus:ring-secondary-300/50 dark:focus:ring-secondary-500/50 focus:ring-offset-1 dark:focus:ring-offset-secondary-800 shadow-sm"
              aria-label="Search button"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Search
              </div>
            </button>
            <button
              onClick={() => {
                /* Add Patient functionality would go here */
              }}
              className="px-5 py-3 bg-primary-600 font-medium rounded-lg border border-primary-700 hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 shadow-md hover:shadow-lg disabled:opacity-50"
              aria-label="Add a new patient"
              disabled
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Patient
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="transition-all duration-300">{renderContent()}</div>
    </div>
  );
};

export default PatientList;
