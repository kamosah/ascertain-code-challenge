import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Patient } from '@queries/patient';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  Group,
  Text,
  Button,
  Stack,
  Badge,
  ActionIcon,
  UnstyledButton,
  Center,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronDown,
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';

// Extend the column meta to include className
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

interface PatientTableProps {
  patients: Patient[];
  totalCount: number;
}

// Create a column helper for type safety
const columnHelper = createColumnHelper<Patient>();

const PatientTable: React.FC<PatientTableProps> = ({ patients, totalCount }) => {
  const navigate = useNavigate();

  // Define table columns using TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Name',
        cell: (info) => (
          <Text fw={500} size="sm">
            {info.getValue()}
          </Text>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('birth_date', {
        header: 'DOB',
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <Text size="sm" c="dimmed">
              {date.toLocaleDateString()}
            </Text>
          );
        },
        enableSorting: true,
        meta: {
          className: 'visible-from-sm', // Custom class for responsive hiding
        },
      }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => (
          <Text size="sm" ff="monospace" c="dimmed">
            {info.getValue()}
          </Text>
        ),
        enableSorting: true,
        meta: {
          className: 'visible-from-md',
        },
      }),
      columnHelper.accessor('resourceType', {
        header: 'Resource Type',
        cell: (info) => (
          <Badge variant="light" size="sm">
            {info.getValue()}
          </Badge>
        ),
        enableSorting: true,
        meta: {
          className: 'visible-from-lg',
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const patient = row.original;
          
          const handleViewPatient = () => {
            navigate(`/patients/${patient.id}`);
          };

          return (
            <Group gap="xs" justify="flex-end">
              <ActionIcon 
                variant="subtle" 
                size="sm" 
                aria-label={`View ${patient.full_name} details`}
                onClick={handleViewPatient}
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                size="sm" 
                aria-label={`Edit ${patient.full_name}`}
                disabled
                color="gray"
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                size="sm" 
                aria-label={`Delete ${patient.full_name}`}
                disabled
                color="red"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          );
        },
        enableSorting: false,
      }),
    ],
    [navigate]
  );

  // Initialize sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'full_name', desc: false }, // Default sort by name ascending
  ]);

  // Create the table instance
  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Helper function to render sort indicator
  const renderSortIcon = (isSorted: false | 'asc' | 'desc') => {
    if (isSorted === 'asc') {
      return <IconChevronUp size={14} />;
    }
    if (isSorted === 'desc') {
      return <IconChevronDown size={14} />;
    }
    return null;
  };

  return (
    <Stack gap="md">
      <Paper shadow="xl" radius="lg" withBorder>
        <Table.ScrollContainer minWidth={600}>
          <Table striped verticalSpacing="md">
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      key={header.id}
                      className={header.column.columnDef.meta?.className}
                      style={{
                        width: header.getSize(),
                        textAlign: header.id === 'actions' ? 'right' : 'left',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <UnstyledButton
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!header.column.getCanSort()}
                          style={{
                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            width: '100%',
                            justifyContent: header.id === 'actions' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <Text fw={600} size="sm">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Text>
                          {header.column.getCanSort() && (
                            <Center>{renderSortIcon(header.column.getIsSorted())}</Center>
                          )}
                        </UnstyledButton>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody data-testid="patient-rows">
              {table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id} className={cell.column.columnDef.meta?.className}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
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

          <Badge variant="default" size="lg">
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
