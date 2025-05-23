import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientList from '../PatientList';
import { usePatients, type Patient } from '@queries/patient';

// Create a type for the usePatients mock return
type UsePatientsReturn = {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  data?: { patients: Patient[] } | null;
  refetch: () => void;
};

// Mock the patient query hook
vi.mock('@queries/patient', () => ({
  usePatients: vi.fn(),
  // Make sure we export the Patient type to match imports in the test file
  Patient: undefined,
}));

// Mock the UI components
vi.mock('@components/patients/ui/LoadingState', () => ({
  default: () => <div data-testid="loading-state">Loading...</div>,
}));

vi.mock('@components/patients/ui/ErrorState', () => ({
  default: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div data-testid="error-state" onClick={onRetry}>
      {message}
    </div>
  ),
}));

vi.mock('@components/patients/ui/EmptyState', () => ({
  default: ({ title, message }: { title?: string; message?: string }) => (
    <div data-testid="empty-state">
      {title || 'No patients found'}
      {message && <div>{message}</div>}
    </div>
  ),
}));

vi.mock('@components/patients/PatientRow', () => ({
  default: ({ patient }: { patient: Patient }) => (
    <tr data-testid={`patient-row-${patient.id}`}>
      <td>{patient.full_name}</td>
    </tr>
  ),
}));

// Create a wrapper with React Query client for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
};

describe('PatientList Component', () => {
  const mockPatients: Patient[] = [
    {
      id: '001',
      full_name: 'John Doe',
      birth_date: '1980-01-01',
      resourceType: 'Patient',
    } as Patient,
    {
      id: '002',
      full_name: 'Jane Smith',
      birth_date: '1985-02-15',
      resourceType: 'Patient',
    } as Patient,
    {
      id: '003',
      full_name: 'Bob Johnson',
      birth_date: '1975-11-30',
      resourceType: 'Patient',
    } as Patient,
  ];

  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when data is loading', () => {
    // Setup the mock to return loading state
    (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      refetch: mockRefetch,
    } as UsePatientsReturn);

    renderWithClient(<PatientList />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should show error state when there is an error', () => {
    // Setup the mock to return error state
    const mockError = new Error('Failed to fetch');
    (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: mockRefetch,
    } as UsePatientsReturn);

    renderWithClient(<PatientList />);
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByTestId('error-state').textContent).toContain('Failed to fetch');

    // Test refetch functionality
    fireEvent.click(screen.getByTestId('error-state'));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should show empty state when no patients are found', () => {
    // Setup the mock to return empty data
    (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { patients: [] },
      refetch: mockRefetch,
    } as UsePatientsReturn);

    renderWithClient(<PatientList />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('should render a list of patients', async () => {
    // Setup the mock to return patient data
    (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { patients: mockPatients },
      refetch: mockRefetch,
    } as UsePatientsReturn);

    renderWithClient(<PatientList />);

    // Check that patient rows are rendered
    expect(screen.getByTestId('patient-row-001')).toBeInTheDocument();
    expect(screen.getByTestId('patient-row-002')).toBeInTheDocument();
    expect(screen.getByTestId('patient-row-003')).toBeInTheDocument();

    // Check that the patient count is displayed correctly
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getAllByText('3', { selector: 'span.font-medium' }).length).toBe(2);
  });

  it('should filter patients by name when searching', async () => {
    // Setup the mock to return patient data
    (usePatients as ReturnType<typeof vi.fn>).mockImplementation(
      (params: { name?: string } | undefined) => {
        // Simulate backend filtering for initial data load
        if (!params) {
          return {
            isLoading: false,
            isError: false,
            data: { patients: mockPatients },
            refetch: mockRefetch,
          } as UsePatientsReturn;
        }

        // Simulate backend filtering when search query is provided
        // Actual component uses frontend filtering after initial backend search
        return {
          isLoading: false,
          isError: false,
          data: {
            patients: mockPatients,
          },
          refetch: mockRefetch,
        } as UsePatientsReturn;
      }
    );

    renderWithClient(<PatientList />);

    // Initial render should show all patients
    expect(screen.getByTestId('patient-row-001')).toBeInTheDocument();
    expect(screen.getByTestId('patient-row-002')).toBeInTheDocument();
    expect(screen.getByTestId('patient-row-003')).toBeInTheDocument();

    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search patients by name...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    // Trigger search
    const searchButton = screen.getByRole('button', { name: 'Search button' });
    fireEvent.click(searchButton);

    // Wait for the filter to be applied (usePatients is called with new params)
    await waitFor(() => {
      // Now only Jane should be in the list
      expect(screen.queryByTestId('patient-row-001')).not.toBeInTheDocument();
      expect(screen.getByTestId('patient-row-002')).toBeInTheDocument();
      expect(screen.queryByTestId('patient-row-003')).not.toBeInTheDocument();
    });
  });

  it('should trigger search when pressing Enter key', async () => {
    // Setup the mock
    (usePatients as ReturnType<typeof vi.fn>).mockImplementation(
      (params: { name?: string } | undefined) => {
        return {
          isLoading: false,
          isError: false,
          data: {
            patients: params?.name
              ? mockPatients.filter((p) =>
                  p.full_name.toLowerCase().includes((params.name || '').toLowerCase())
                )
              : mockPatients,
          },
          refetch: mockRefetch,
        } as UsePatientsReturn;
      }
    );

    renderWithClient(<PatientList />);

    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search patients by name...');
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

    // Press Enter key
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    // Wait for the filter to be applied
    await waitFor(() => {
      // Now only Bob should be in the list
      expect(screen.queryByTestId('patient-row-001')).not.toBeInTheDocument();
      expect(screen.queryByTestId('patient-row-002')).not.toBeInTheDocument();
      expect(screen.getByTestId('patient-row-003')).toBeInTheDocument();
    });
  });

  it('should show empty state when search returns no results', async () => {
    // Setup the mock
    (usePatients as ReturnType<typeof vi.fn>).mockImplementation(
      // Filtering is done on the frontend after initial backend search
      () => {
        return {
          isLoading: false,
          isError: false,
          data: {
            patients: mockPatients,
          },
          refetch: mockRefetch,
        } as UsePatientsReturn;
      }
    );

    renderWithClient(<PatientList />);

    // Enter search term that won't match any patients
    const searchInput = screen.getByPlaceholderText('Search patients by name...');
    fireEvent.change(searchInput, { target: { value: 'XYZ' } });

    // Trigger search
    const searchButton = screen.getByRole('button', { name: 'Search button' });
    fireEvent.click(searchButton);

    // Wait for the filter to be applied
    await waitFor(() => {
      // Should show custom empty state with "No patients match your search" message
      expect(screen.getByText(/No patients match your search for "XYZ"/i)).toBeInTheDocument();
      // Check for the clear search button
      expect(screen.getByText('Clear Search')).toBeInTheDocument();
    });
  });
});
