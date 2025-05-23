import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import { usePatientDetails } from '@queries/patient';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface PatientInfoRowProps {
  label: string;
  value: string | null | undefined;
}

const PatientInfoRow = ({ label, value }: PatientInfoRowProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value || 'N/A'}</dd>
  </div>
);

const PatientDetails = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'encounters' | 'medications'>('details');

  // Fetch patient details using React Query
  const { data: patient, isLoading, isError, error, refetch } = usePatientDetails(patientId || '');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleBack = () => {
    navigate('/');
  };

  // Loading state
  if (isLoading) return <LoadingState />;

  // Error state
  if (isError || !patient) {
    return (
      <ErrorState
        message={`Failed to load patient details: ${error instanceof Error ? error.message : 'Unknown error'}`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Patients
        </button>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors">
            Edit Patient
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{patient.full_name}</h2>
          <p className="mt-1 text-sm text-gray-500">Patient ID: {patient.id}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Patient Details
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'encounters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('encounters')}
            >
              Encounters
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'medications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('medications')}
            >
              Medications
            </button>
          </nav>
        </div>

        {activeTab === 'details' && (
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <PatientInfoRow label="Full Name" value={patient.full_name} />
              <PatientInfoRow label="Date of Birth" value={formatDate(patient.birth_date)} />
              <PatientInfoRow label="Resource Type" value={patient.resourceType} />
              <PatientInfoRow label="ID" value={patient.id} />
            </dl>
          </div>
        )}

        {activeTab === 'encounters' && (
          <div className="p-6">
            <p className="text-gray-500 italic">Encounter data would be displayed here.</p>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="p-6">
            <p className="text-gray-500 italic">Medication data would be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
