import { Paper, Stack, Loader, Text, Skeleton } from '@mantine/core';

const LoadingState = () => (
  <Paper shadow="md" radius="lg" p="xl" withBorder>
    <Stack align="center" justify="center" gap="lg" style={{ minHeight: '16rem' }}>
      <Loader size="xl" type="dots" />

      <Stack align="center" gap="xs">
        <Text size="lg" fw={500}>
          Loading patients data
        </Text>
        <Text size="sm" c="dimmed">
          This may take a moment...
        </Text>
      </Stack>

      {/* Loading skeleton for table */}
      <Stack gap="md" style={{ width: '100%', maxWidth: '24rem' }}>
        <Skeleton height={12} width="75%" radius="xl" />
        <Skeleton height={12} width="50%" radius="xl" />
        <Skeleton height={12} width="85%" radius="xl" />
      </Stack>
    </Stack>
  </Paper>
);

export default LoadingState;
