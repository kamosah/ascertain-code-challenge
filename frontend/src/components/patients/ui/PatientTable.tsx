import React from 'react';
import { Patient } from '@queries/patient';
import PatientRow from '@components/patients/PatientRow';
import { Paper, Table, Group, Text, Button, Stack, Badge } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface PatientTableProps {
  patients: Patient[];
  totalCount: number;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, totalCount }) => {
  return (
    <Stack gap="md">
      <Paper shadow="xl" radius="lg" withBorder>
        <Table.ScrollContainer minWidth={600}>
          <Table striped verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th visibleFrom="sm">DOB</Table.Th>
                <Table.Th visibleFrom="md">ID</Table.Th>
                <Table.Th visibleFrom="lg">Resource Type</Table.Th>
                <Table.Th ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody data-testid="patient-rows">
              {patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <Group justify="space-between" align="center">
        <Paper p="sm" withBorder radius="md">
          <Text size="sm" c="dimmed">
            Showing{' '}
            <Text component="span" fw={500} c="bright">
              {patients.length}
            </Text>{' '}
            of{' '}
            <Text component="span" fw={500} c="bright">
              {totalCount}
            </Text>{' '}
            patient{totalCount !== 1 ? 's' : ''}
          </Text>
        </Paper>

        <Group gap="xs">
          <Button variant="default" size="sm" leftSection={<IconChevronLeft size={16} />} disabled>
            Previous
          </Button>

          <Badge variant="filled" size="lg">
            Page 1
          </Badge>

          <Button
            variant="default"
            size="sm"
            rightSection={<IconChevronRight size={16} />}
            disabled
          >
            Next
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default PatientTable;
