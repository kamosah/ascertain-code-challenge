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
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value || 'N/A'}</dd>
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
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium text-gray-800 flex items-center">
            <span className="mr-2">Encounter ID:</span>
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">
              {encounter.id}
            </span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">{periodText}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            encounter.status === 'finished'
              ? 'bg-green-100 text-green-800'
              : encounter.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {encounter.status.charAt(0).toUpperCase() + encounter.status.slice(1)}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Reason:</span>
            <p className="text-sm text-gray-900">{reasonText}</p>
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
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium text-gray-800">{medicationName}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Prescribed: {formatDate(medication.authoredOn)}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            medication.status === 'active'
              ? 'bg-green-100 text-green-800'
              : medication.status === 'stopped'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Dosage:</span>
            <p className="text-sm text-gray-900">{dosage}</p>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-gray-500">Intent:</span>
            <p className="text-sm text-gray-900">{medication.intent}</p>
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
          <button
            onClick={() => {
              // Handle edit patient logic here
            }}
            className="px-3 py-1.5 bg-blue-500 text-sm font-medium rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled
          >
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
          <nav className="flex w-full -mb-px">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Patient Details
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 ${
                activeTab === 'encounters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('encounters')}
            >
              Encounters
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 focus:outline-none focus:ring-0 ${
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Encounters</h3>
                {patient.encounters.map((encounter) => (
                  <EncounterCard key={encounter.id} encounter={encounter} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No encounters found for this patient.</p>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="p-6">
            {patient.medications && patient.medications.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Medications</h3>
                {patient.medications.map((medication) => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No medications found for this patient.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
