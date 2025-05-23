interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = 'No patients found',
  message = 'There are no patients in the system yet.',
}: EmptyStateProps) => (
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-center">
    <p className="text-lg font-medium">{title}</p>
    <p className="mt-2">{message}</p>
  </div>
);

export default EmptyState;
