import Layout from '@components/Layout';
import PatientDetails from '@components/patients/PatientDetails';
import PatientList from '@components/patients/PatientList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
          <div className="space-y-6 custom-scrollbar animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white transition-colors duration-200">
              Patient Management
            </h1>
            <div className="theme-transition">
              <Routes>
                <Route path="/" element={<PatientList />} />
                <Route path="/patients/:patientId" element={<PatientDetails />} />
              </Routes>
            </div>
          </div>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
