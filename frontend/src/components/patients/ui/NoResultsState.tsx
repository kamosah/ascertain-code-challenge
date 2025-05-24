import React from 'react';
import { Paper, Stack, ThemeIcon, Title, Text, Button, Group, Code } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface NoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ searchQuery, onClearSearch }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <Paper shadow="md" radius="xl" p="xl" withBorder style={{ maxWidth: '32rem', width: '100%' }}>
        <Stack align="center" gap="lg">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'gray.1', to: 'gray.3', deg: 45 }}
          >
            <IconSearch size={40} />
          </ThemeIcon>

          <Stack align="center" gap="sm">
            <Title order={3} ta="center">
              No patients found
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              No patients match your search for:
            </Text>
            <Code fz="md" bg="gray.1" style={{ padding: '0.75rem 1rem' }}>
              "{searchQuery}"
            </Code>
          </Stack>

          <Group gap="md">
            <Button leftSection={<IconX size={20} />} onClick={onClearSearch} size="md" radius="md">
              Clear Search
            </Button>
            <Button
              variant="light"
              color="gray"
              size="md"
              radius="md"
              onClick={() => {
                /* Add Patient functionality would go here */
              }}
            >
              Try Different Search
            </Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
};

export default NoResultsState;
