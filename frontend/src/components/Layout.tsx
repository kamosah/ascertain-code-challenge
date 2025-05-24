import { AppShell, Container, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell
      footer={{ height: 60 }}
      styles={{
        main: {
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: 'var(--mantine-color-body)',
        },
      }}
    >
      <AppShell.Main>
        <Container size="xl" py="xl">
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          borderTop: '1px solid var(--mantine-color-gray-3)',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Group justify="center" h="100%">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} Patient Portal. All rights reserved.
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;
