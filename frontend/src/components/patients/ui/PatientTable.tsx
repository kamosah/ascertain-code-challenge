import React from 'react';
import { Patient } from '@queries/patient';
import PatientRow from '@components/patients/PatientRow';

interface PatientTableProps {
  patients: Patient[];
  totalCount: number;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, totalCount }) => {
  return (
    <>
      <div className="w-full bg-white dark:bg-secondary-800 shadow-xl rounded-lg overflow-hidden transition-all duration-200 animate-fade-in border border-secondary-200 dark:border-secondary-700">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700 text-left">
            <thead className="bg-secondary-50 dark:bg-secondary-700/30">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider hidden sm:table-cell"
                >
                  DOB
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider hidden md:table-cell"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider hidden lg:table-cell"
                >
                  Resource Type
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-right text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700"
              data-testid="patient-rows"
            >
              {patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-5 animate-fade-in">
        <div className="text-sm text-secondary-600 dark:text-secondary-400 bg-white dark:bg-secondary-800 px-4 py-2.5 rounded-md shadow-sm border border-secondary-200 dark:border-secondary-700">
          Showing{' '}
          <span className="font-medium text-secondary-900 dark:text-white">{patients.length}</span>{' '}
          of <span className="font-medium text-secondary-900 dark:text-white">{totalCount}</span>{' '}
          patient{totalCount !== 1 ? 's' : ''}
        </div>

        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button
            className="px-4 py-2.5 text-sm bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm"
            disabled
            aria-label="Go to previous page"
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </div>
          </button>
          <span className="bg-primary-600 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 font-medium rounded-md shadow-sm">
            Page 1
          </span>
          <button
            className="px-4 py-2.5 text-sm bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm"
            disabled
            aria-label="Go to next page"
          >
            <div className="flex items-center">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientTable;
