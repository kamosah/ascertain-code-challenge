import { Paper, Stack, ThemeIcon, Title, Text, Button } from '@mantine/core';
import { IconUsers, IconPlus } from '@tabler/icons-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = 'No patients found',
  message = 'There are no patients in the system yet.',
}: EmptyStateProps) => (
  <Paper shadow="md" radius="xl" p="xl" withBorder style={{ maxWidth: '36rem', margin: '0 auto' }}>
    <Stack align="center" gap="lg">
      <ThemeIcon size={80} radius="xl" variant="light" color="gray">
        <IconUsers size={40} />
      </ThemeIcon>

      <Stack align="center" gap="sm">
        <Title order={3} ta="center">
          {title}
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          {message}
        </Text>
      </Stack>

      <Button leftSection={<IconPlus size={20} />} size="md" radius="md">
        Add Your First Patient
      </Button>
    </Stack>
  </Paper>
);

export default EmptyState;
