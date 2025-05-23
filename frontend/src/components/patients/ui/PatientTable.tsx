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
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  DOB
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Resource Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{patients.length}</span> of{' '}
          <span className="font-medium">{totalCount}</span> patient(s)
        </div>
      </div>
    </>
  );
};

export default PatientTable;
