import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import { usePatientDetails, type Encounter, type MedicationRequest } from '@queries/patient';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Tabs,
  Card,
  Code,
  Divider,
} from '@mantine/core';
import { IconArrowLeft, IconEdit, IconCalendar, IconPill } from '@tabler/icons-react';

interface PatientInfoRowProps {
  label: string;
  value: string | null | undefined;
}

const PatientInfoRow = ({ label, value }: PatientInfoRowProps) => (
  <Group justify="space-between" py="sm">
    <Text size="sm" fw={500} c="dimmed" style={{ minWidth: '120px' }}>
      {label}
    </Text>
    <Text size="sm" style={{ textAlign: 'right', flex: 1 }}>
      {value || 'N/A'}
    </Text>
  </Group>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finished':
        return 'green';
      case 'in-progress':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
      <Group justify="space-between" mb="xs">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="xs">
            <Text fw={500} size="sm">
              Encounter ID:
            </Text>
            <Code fz="xs">{encounter.id}</Code>
          </Group>
          <Text size="xs" c="dimmed">
            {periodText}
          </Text>
        </Stack>
        <Badge color={getStatusColor(encounter.status)} variant="light" size="sm">
          {encounter.status.charAt(0).toUpperCase() + encounter.status.slice(1)}
        </Badge>
      </Group>
      <Divider my="xs" />
      <Stack gap="xs">
        <Group gap="xs">
          <Text size="sm" fw={500} c="dimmed">
            Reason:
          </Text>
        </Group>
        <Text size="sm">{reasonText}</Text>
      </Stack>
    </Card>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'stopped':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
      <Group justify="space-between" mb="xs">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={4} size="md">
            {medicationName}
          </Title>
          <Text size="xs" c="dimmed">
            Prescribed: {formatDate(medication.authoredOn)}
          </Text>
        </Stack>
        <Badge color={getStatusColor(medication.status)} variant="light" size="sm">
          {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
        </Badge>
      </Group>
      <Divider my="xs" />
      <Stack gap="xs">
        <Group gap="xs">
          <Text size="sm" fw={500} c="dimmed">
            Dosage:
          </Text>
        </Group>
        <Text size="sm">{dosage}</Text>
        <Group gap="xs" mt="xs">
          <Text size="sm" fw={500} c="dimmed">
            Intent:
          </Text>
          <Text size="sm">{medication.intent}</Text>
        </Group>
      </Stack>
    </Card>
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
    <Stack gap="lg">
      <Group justify="space-between">
        <Button leftSection={<IconArrowLeft size={16} />} variant="subtle" onClick={handleBack}>
          Back to Patients
        </Button>
        <Button leftSection={<IconEdit size={16} />} disabled size="sm">
          Edit Patient
        </Button>
      </Group>

      <Paper shadow="sm" radius="md" withBorder>
        <Stack gap={0}>
          <Group
            justify="space-between"
            p="lg"
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            <Stack gap="xs">
              <Title order={2}>{patient.full_name}</Title>
              <Text size="sm" c="dimmed">
                Patient ID: {patient.id}
              </Text>
            </Stack>
          </Group>

          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'details' | 'encounters' | 'medications')}
          >
            <Tabs.List grow>
              <Tabs.Tab value="details">Patient Details</Tabs.Tab>
              <Tabs.Tab value="encounters" leftSection={<IconCalendar size={16} />}>
                Encounters
              </Tabs.Tab>
              <Tabs.Tab value="medications" leftSection={<IconPill size={16} />}>
                Medications
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details" p="lg">
              <Stack gap="xs">
                <PatientInfoRow label="Full Name" value={patient.full_name} />
                <Divider />
                <PatientInfoRow label="Date of Birth" value={formatDate(patient.birth_date)} />
                <Divider />
                <PatientInfoRow label="Gender" value={patient.gender} />
                <Divider />
                <PatientInfoRow label="Address" value={patient.address} />
                <Divider />
                <PatientInfoRow label="Phone" value={patient.phone} />
                <Divider />
                <PatientInfoRow label="Email" value={patient.email} />
                <Divider />
                <PatientInfoRow label="Resource Type" value={patient.resourceType} />
                <Divider />
                <PatientInfoRow label="ID" value={patient.id} />
                <Divider />
                {patient.encounters && (
                  <>
                    <PatientInfoRow
                      label="Encounter Count"
                      value={String(patient.encounters.length)}
                    />
                    <Divider />
                  </>
                )}
                {patient.medications && (
                  <PatientInfoRow
                    label="Medication Count"
                    value={String(patient.medications.length)}
                  />
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="encounters" p="lg">
              {patient.encounters && patient.encounters.length > 0 ? (
                <Stack gap="md">
                  <Title order={3}>Patient Encounters</Title>
                  {patient.encounters.map((encounter) => (
                    <EncounterCard key={encounter.id} encounter={encounter} />
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" fs="italic">
                  No encounters found for this patient.
                </Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="medications" p="lg">
              {patient.medications && patient.medications.length > 0 ? (
                <Stack gap="md">
                  <Title order={3}>Patient Medications</Title>
                  {patient.medications.map((medication) => (
                    <MedicationCard key={medication.id} medication={medication} />
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" fs="italic">
                  No medications found for this patient.
                </Text>
              )}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PatientDetails;
