import React from 'react';

interface NoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ searchQuery, onClearSearch }) => {
  return (
    <div className="flex items-center justify-center mt-8 animate-fade-in">
      <div className="text-center p-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-md max-w-lg w-full transition-all duration-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-700 dark:to-secondary-800 rounded-full mb-6 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-secondary-500 dark:text-secondary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-secondary-800 dark:text-white mb-3">
          No patients found
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mb-2 text-lg">
          No patients match your search for:
        </p>
        <div className="bg-secondary-100 dark:bg-secondary-700/50 text-secondary-900 dark:text-secondary-200 px-4 py-3 rounded-lg inline-block mb-6 font-mono">
          "{searchQuery}"
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClearSearch}
            className="px-5 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 shadow-md hover:shadow-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Clear Search
          </button>
          <button
            onClick={() => {
              /* Add Patient functionality would go here */
            }}
            className="px-5 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all duration-200 border border-secondary-200 dark:border-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-300/50 dark:focus:ring-secondary-500/50 shadow-sm"
          >
            Try Different Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoResultsState;
