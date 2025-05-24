import Layout from '@layout/Layout';
import PatientDetails from '@views/patients/PatientDetails';
import PatientList from '@views/patients/PatientList';
import ThemeToggle from '@ui/ThemeToggle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Stack, Title, Group } from '@mantine/core';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Stack gap="xl">
            <Group justify="space-between" align="center">
              <Title order={1} size="h1">
                Patient Management
              </Title>
              <ThemeToggle />
            </Group>
            <Routes>
              <Route path="/" element={<PatientList />} />
              <Route path="/patients/:patientId" element={<PatientDetails />} />
            </Routes>
          </Stack>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
