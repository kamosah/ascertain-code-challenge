import { Patient } from '@queries/patient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Table, ActionIcon, Badge, Code, Group, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface PatientRowProps {
  patient: Patient;
}

const PatientRow = ({ patient }: PatientRowProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  const getHoverColor = () => {
    return colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPatient = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <Table.Tr
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        backgroundColor: isHovered ? getHoverColor() : 'transparent',
      }}
    >
      <Table.Td>
        <div>
          <Text fw={500} size="sm">
            {patient.full_name}
          </Text>
          <Text size="xs" c="dimmed" hiddenFrom="sm">
            DOB: {formatDate(patient.birth_date)}
          </Text>
        </div>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Text size="sm" c="dimmed">
          {formatDate(patient.birth_date)}
        </Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Code fz="xs">{patient.id}</Code>
      </Table.Td>
      <Table.Td visibleFrom="lg">
        <Badge variant="light" color="blue" size="sm">
          {patient.resourceType}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group justify="flex-end" gap="xs">
          <Tooltip label={`View ${patient.full_name}`}>
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={handleViewPatient}
              aria-label={`View ${patient.full_name}`}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={`Edit ${patient.full_name}`}>
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled
              aria-label={`Edit ${patient.full_name}`}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={`Delete ${patient.full_name}`}>
            <ActionIcon
              variant="subtle"
              color="red"
              disabled
              aria-label={`Delete ${patient.full_name}`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

export default PatientRow;
