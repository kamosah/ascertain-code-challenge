import EmptyState from '@components/patients/ui/EmptyState';
import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import NoResultsState from '@components/patients/ui/NoResultsState';
import PatientTable from '@components/patients/ui/PatientTable';
import { usePatients } from '@queries/patient';
import { useState, useMemo } from 'react';

const PatientList = () => {
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Use React Query to fetch patients data
  const { data, isLoading, isError, error, refetch } = usePatients(
    searchQuery ? { name: searchQuery, limit: 25 } : undefined
  );

  const handleSearch = () => {
    setSearchQuery(searchName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchName('');
  };

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
    <div className="w-full overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient List</h2>

        <div className="flex flex-row gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex-grow text-sm"
            aria-label="Search patients"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            aria-label="Search button"
          >
            Search
          </button>
          <button
            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
            aria-label="Add a new patient"
          >
            Add Patient
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default PatientList;
