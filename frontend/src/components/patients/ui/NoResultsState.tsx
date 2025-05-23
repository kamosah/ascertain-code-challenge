import React from 'react';

interface NoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ searchQuery, onClearSearch }) => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
        <p className="text-lg font-medium">No patients found</p>
        <p className="mt-2">No patients match your search for "{searchQuery}"</p>
        <button
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
};

export default NoResultsState;
