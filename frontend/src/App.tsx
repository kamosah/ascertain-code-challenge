import Layout from '@components/Layout';
import PatientDetails from '@components/patients/PatientDetails';
import PatientList from '@components/patients/PatientList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Stack, Title } from '@mantine/core';
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
            <Title order={1} size="h1">
              Patient Management
            </Title>
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
