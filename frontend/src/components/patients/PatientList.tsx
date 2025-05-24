import EmptyState from '@components/patients/ui/EmptyState';
import ErrorState from '@components/patients/ui/ErrorState';
import LoadingState from '@components/patients/ui/LoadingState';
import NoResultsState from '@components/patients/ui/NoResultsState';
import PatientTable from '@components/patients/ui/PatientTable';
import { usePatients } from '@queries/patient';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Paper, TextInput, Button, Group, Title, Stack, ActionIcon, Flex } from '@mantine/core';
import { IconSearch, IconUserPlus, IconUsers, IconX } from '@tabler/icons-react';

const PatientList = () => {
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use React Query to fetch patients data
  const { data, isLoading, isError, error, refetch } = usePatients(
    searchQuery ? { name: searchQuery, limit: 10 } : undefined
  );

  const handleSearch = () => {
    setIsSearching(true);
    setSearchQuery(searchName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchQuery('');
    setIsSearching(false);
    // Focus the search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Auto-focus the search input on initial render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Reset search animation state after animation completes
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSearching]);

  // Memoize filtered patients to avoid unnecessary recalculations
  const filteredPatients = useMemo(() => {
    return data?.patients
      ? data.patients.filter((patient) =>
          patient.full_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  }, [data?.patients, searchQuery]);

  // Determine the content to display based on state
  const renderContent = () => {
    // Loading state
    if (isLoading) return <LoadingState />;

    // Error state
    if (isError) {
      return (
        <ErrorState
          message={`Failed to load patients: ${error instanceof Error ? error.message : 'Unknown error'}`}
          onRetry={() => refetch()}
        />
      );
    }

    // Empty initial state (no patients in the system)
    if (!data || !data.patients || data.patients.length === 0) return <EmptyState />;

    // No patients match search criteria
    if (filteredPatients.length === 0) {
      return <NoResultsState searchQuery={searchQuery} onClearSearch={handleClearSearch} />;
    }

    // Display patient table
    return <PatientTable patients={filteredPatients} totalCount={data.patients.length} />;
  };

  return (
    <Stack gap="xl">
      <Paper p="xl" shadow="md" radius="lg" withBorder>
        <Group justify="flex-start" mb="xl">
          <Title order={2} c="primary">
            <Group gap="xs">
              <IconUsers size={24} />
              Patient List
            </Group>
          </Title>
        </Group>

        <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
          <TextInput
            ref={searchInputRef}
            placeholder="Search patients by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
            leftSection={<IconSearch size={18} />}
            rightSection={
              searchName ? (
                <ActionIcon
                  variant="subtle"
                  onClick={() => setSearchName('')}
                  aria-label="Clear search input"
                >
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
            style={{ flex: 1 }}
            size="md"
            aria-label="Search patients"
          />

          <Group gap="sm">
            <Button
              onClick={handleSearch}
              variant="light"
              leftSection={<IconSearch size={18} />}
              size="md"
              aria-label="Search button"
            >
              Search
            </Button>

            <Button
              onClick={() => {
                /* Add Patient functionality would go here */
              }}
              leftSection={<IconUserPlus size={18} />}
              disabled
              size="md"
              aria-label="Add a new patient"
            >
              Add Patient
            </Button>
          </Group>
        </Flex>
      </Paper>

      {renderContent()}
    </Stack>
  );
};

export default PatientList;
