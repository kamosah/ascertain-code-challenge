import { Paper, Stack, Group, ThemeIcon, Title, Text, Button, Alert } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <Paper
    shadow="md"
    radius="lg"
    p="lg"
    withBorder
    style={{
      maxWidth: '48rem',
      margin: '0 auto',
      borderLeftWidth: '4px',
      borderLeftColor: 'var(--mantine-color-red-6)',
    }}
  >
    <Group align="flex-start" gap="lg">
      <ThemeIcon size={64} radius="xl" variant="light" color="red">
        <IconAlertCircle size={32} />
      </ThemeIcon>

      <Stack gap="md" style={{ flex: 1 }}>
        <Title order={3} c="red">
          Failed to load patients
        </Title>

        <Alert variant="light" color="red" radius="md">
          <Text size="sm">{message}</Text>
        </Alert>

        <Button
          leftSection={<IconRefresh size={20} />}
          color="red"
          onClick={onRetry}
          size="sm"
          style={{ alignSelf: 'flex-start' }}
        >
          Retry
        </Button>
      </Stack>
    </Group>
  </Paper>
);

export default ErrorState;
