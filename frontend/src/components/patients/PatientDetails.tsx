import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import { usePatientDetails, type Encounter, type MedicationRequest } from '@queries/patient';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface PatientInfoRowProps {
  label: string;
  value: string | null | undefined;
}

const PatientInfoRow = ({ label, value }: PatientInfoRowProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{label}</dt>
    <dd className="mt-1 text-sm text-secondary-900 dark:text-white sm:col-span-2 sm:mt-0">
      {value || 'N/A'}
    </dd>
  </div>
);

interface EncounterCardProps {
  encounter: Encounter;
}

const EncounterCard = ({ encounter }: EncounterCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Extract reason text from reasonCode if available
  const reasonText =
    encounter.reasonCode?.[0]?.text ||
    encounter.reasonCode?.[0]?.coding?.[0]?.display ||
    'No reason provided';

  // Format period (start and end dates)
  const periodText = encounter.period
    ? `${formatDate(encounter.period.start)} ${encounter.period.end ? `to ${formatDate(encounter.period.end)}` : ''}`
    : 'Date not specified';

  return (
    <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600 flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium text-secondary-800 dark:text-white flex items-center">
            <span className="mr-2">Encounter ID:</span>
            <span className="font-mono bg-secondary-100 dark:bg-secondary-600 px-2 py-0.5 rounded text-sm">
              {encounter.id}
            </span>
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{periodText}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            encounter.status === 'finished'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : encounter.status === 'in-progress'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300'
          }`}
        >
          {encounter.status.charAt(0).toUpperCase() + encounter.status.slice(1)}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
              Reason:
            </span>
            <p className="text-sm text-secondary-900 dark:text-white">{reasonText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MedicationCardProps {
  medication: MedicationRequest;
}

const MedicationCard = ({ medication }: MedicationCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Extract medication name from medicationCodeableConcept
  const medicationName =
    medication.medicationCodeableConcept?.text ||
    medication.medicationCodeableConcept?.coding?.[0]?.display ||
    'Unknown medication';

  // Extract dosage instructions if available
  const dosage = medication.dosageInstruction?.[0]?.text || 'No dosage instructions provided';

  return (
    <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600 flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium text-secondary-800 dark:text-white">
            {medicationName}
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            Prescribed: {formatDate(medication.authoredOn)}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            medication.status === 'active'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : medication.status === 'stopped'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300'
          }`}
        >
          {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
              Dosage:
            </span>
            <p className="text-sm text-secondary-900 dark:text-white">{dosage}</p>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
              Intent:
            </span>
            <p className="text-sm text-secondary-900 dark:text-white">{medication.intent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
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
          <button
            onClick={() => {
              // Handle edit patient logic here
            }}
            className="px-3 py-1.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors disabled:opacity-50"
            disabled
          >
            Edit Patient
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 shadow rounded-lg overflow-hidden mb-6 transition-colors">
        <div className="px-4 py-5 sm:px-6 bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600 transition-colors">
          <h2 className="text-xl font-semibold text-secondary-800 dark:text-white">
            {patient.full_name}
          </h2>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Patient ID: {patient.id}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200 dark:border-secondary-600 transition-colors">
          <nav className="flex w-full -mb-px">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 transition-colors rounded-none ${
                activeTab === 'details'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-500'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Patient Details
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 transition-colors rounded-none ${
                activeTab === 'encounters'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-500'
              }`}
              onClick={() => setActiveTab('encounters')}
            >
              Encounters
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 transition-colors rounded-none ${
                activeTab === 'medications'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-500'
              }`}
              onClick={() => setActiveTab('medications')}
            >
              Medications
            </button>
          </nav>
        </div>

        {activeTab === 'details' && (
          <div className="border-t border-secondary-200 dark:border-secondary-600">
            <dl className="divide-y divide-secondary-200 dark:divide-secondary-600">
              <PatientInfoRow label="Full Name" value={patient.full_name} />
              <PatientInfoRow label="Date of Birth" value={formatDate(patient.birth_date)} />
              <PatientInfoRow label="Gender" value={patient.gender} />
              <PatientInfoRow label="Address" value={patient.address} />
              <PatientInfoRow label="Phone" value={patient.phone} />
              <PatientInfoRow label="Email" value={patient.email} />
              <PatientInfoRow label="Resource Type" value={patient.resourceType} />
              <PatientInfoRow label="ID" value={patient.id} />
              {patient.encounters && (
                <PatientInfoRow label="Encounter Count" value={String(patient.encounters.length)} />
              )}
              {patient.medications && (
                <PatientInfoRow
                  label="Medication Count"
                  value={String(patient.medications.length)}
                />
              )}
            </dl>
          </div>
        )}

        {activeTab === 'encounters' && (
          <div className="p-6">
            {patient.encounters && patient.encounters.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                  Patient Encounters
                </h3>
                {patient.encounters.map((encounter) => (
                  <EncounterCard key={encounter.id} encounter={encounter} />
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 italic">
                No encounters found for this patient.
              </p>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="p-6">
            {patient.medications && patient.medications.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                  Patient Medications
                </h3>
                {patient.medications.map((medication) => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 italic">
                No medications found for this patient.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
