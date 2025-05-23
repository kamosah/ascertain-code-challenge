interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = 'No patients found',
  message = 'There are no patients in the system yet.',
}: EmptyStateProps) => (
  <div className="p-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-md text-secondary-800 dark:text-secondary-200 text-center transition-all duration-200 animate-fade-in max-w-xl mx-auto">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 dark:bg-secondary-700 rounded-full mb-6 shadow-inner">
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-3 text-secondary-900 dark:text-white">{title}</h3>
    <p className="text-secondary-600 dark:text-secondary-400 text-lg">{message}</p>

    <button className="mt-6 inline-flex items-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 shadow-md hover:shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      Add Your First Patient
    </button>
  </div>
);

export default EmptyState;
