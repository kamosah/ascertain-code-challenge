import { Patient } from '@queries/patient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface PatientRowProps {
  patient: Patient;
}

const PatientRow = ({ patient }: PatientRowProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isActionHovered, setIsActionHovered] = useState('');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPatient = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <tr
      className="transition-all duration-200 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 border-b border-secondary-200 dark:border-secondary-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-secondary-900 dark:text-white">
              {patient.full_name}
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5 sm:hidden">
              DOB: {formatDate(patient.birth_date)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          {formatDate(patient.birth_date)}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          <span className="font-mono bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded text-xs">
            {patient.id}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap hidden lg:table-cell">
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
            {patient.resourceType}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div
          className={`flex justify-end gap-2 transition-all ${isHovered ? 'opacity-100 scale-100' : 'opacity-70 scale-95 sm:opacity-100 sm:scale-100'}`}
        >
          <button
            onClick={handleViewPatient}
            onMouseEnter={() => setIsActionHovered('view')}
            onMouseLeave={() => setIsActionHovered('')}
            className="relative group text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-1 dark:focus:ring-offset-secondary-800 rounded-md p-1.5"
            aria-label={`View ${patient.full_name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {isActionHovered === 'view' && (
              <span className="absolute top-full right-0 mt-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity animate-scale-up">
                View patient
              </span>
            )}
          </button>
          <button
            onMouseEnter={() => setIsActionHovered('edit')}
            onMouseLeave={() => setIsActionHovered('')}
            className="relative group text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:ring-offset-1 dark:focus:ring-offset-secondary-800 rounded-md p-1.5"
            aria-label={`Edit ${patient.full_name}`}
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {isActionHovered === 'edit' && (
              <span className="absolute top-full right-0 mt-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity animate-scale-up">
                Edit patient
              </span>
            )}
          </button>
          <button
            onMouseEnter={() => setIsActionHovered('delete')}
            onMouseLeave={() => setIsActionHovered('')}
            className="relative group text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-1 dark:focus:ring-offset-secondary-800 rounded-md p-1.5"
            aria-label={`Delete ${patient.full_name}`}
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {isActionHovered === 'delete' && (
              <span className="absolute top-full right-0 mt-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity animate-scale-up">
                Delete patient
              </span>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PatientRow;
