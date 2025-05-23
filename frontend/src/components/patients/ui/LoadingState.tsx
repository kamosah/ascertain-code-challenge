const LoadingState = () => (
  <div className="bg-white dark:bg-secondary-800 shadow-md rounded-lg p-8 transition-all duration-300 animate-fade-in border border-secondary-200 dark:border-secondary-700">
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-20 h-20 relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-200 dark:border-primary-900/30"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-secondary-800 dark:text-secondary-200">
          Loading patients data
        </p>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          This may take a moment...
        </p>
      </div>

      {/* Loading skeleton for table */}
      <div className="w-full max-w-md mt-8">
        <div className="h-3 w-3/4 bg-secondary-200 dark:bg-secondary-700 rounded-full mb-4 animate-pulse"></div>
        <div
          className="h-3 w-1/2 bg-secondary-200 dark:bg-secondary-700 rounded-full mb-4 animate-pulse"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="h-3 w-5/6 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  </div>
);

export default LoadingState;
