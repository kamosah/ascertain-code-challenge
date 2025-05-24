import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@test/utils';
import PatientDetails from '../PatientDetails';
import {
  usePatientDetails,
  type Patient,
  type Encounter,
  type MedicationRequest,
} from '@queries/patient';

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockPatientId = 'test-patient-123';

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ patientId: mockPatientId }),
}));

// Mock the patient query hook
vi.mock('@queries/patient', () => ({
  usePatientDetails: vi.fn(),
}));

// Mock the UI components
vi.mock('@ui/LoadingState', () => ({
  default: () => <div data-testid="loading-state">Loading patient details...</div>,
}));

vi.mock('@ui/ErrorState', () => ({
  default: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <p>{message}</p>
      <button onClick={onRetry} data-testid="retry-button">
        Retry
      </button>
    </div>
  ),
}));

// Create mock data
const mockEncounter: Encounter = {
  resourceType: 'Encounter',
  id: 'encounter-123',
  status: 'finished',
  period: {
    start: '2024-01-15T10:30:00Z',
    end: '2024-01-15T11:00:00Z',
  },
  reasonCode: [
    {
      text: 'Annual checkup',
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '185349003',
          display: 'Encounter for check up',
        },
      ],
    },
  ],
};

const mockMedication: MedicationRequest = {
  resourceType: 'MedicationRequest',
  id: 'medication-456',
  status: 'active',
  medicationCodeableConcept: {
    text: 'Lisinopril 10mg',
    coding: [
      {
        system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
        code: '29046',
        display: 'Lisinopril',
      },
    ],
  },
  authoredOn: '2024-01-15T10:30:00Z',
  intent: 'order',
  dosageInstruction: [
    {
      text: 'Take one tablet by mouth daily',
      timing: {
        repeat: {
          frequency: 1,
          period: 1,
          periodUnit: 'd',
        },
      },
      route: {
        text: 'Oral',
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '26643006',
            display: 'Oral route',
          },
        ],
      },
      doseAndRate: [
        {
          doseQuantity: {
            value: 1,
            unit: 'tablet',
          },
        },
      ],
    },
  ],
};

const mockPatient: Patient = {
  id: 'patient-123',
  full_name: 'John Doe',
  birth_date: '1990-05-15',
  gender: 'male',
  address: '123 Main St, Anytown, USA',
  phone: '+1-555-123-4567',
  email: 'john.doe@example.com',
  resourceType: 'Patient',
  encounters: [mockEncounter],
  medications: [mockMedication],
};

const mockPatientWithoutEncountersOrMedications: Patient = {
  id: 'patient-456',
  full_name: 'Jane Smith',
  birth_date: '1985-08-22',
  gender: 'female',
  address: null,
  phone: null,
  email: null,
  resourceType: 'Patient',
  encounters: [],
  medications: [],
};

const mockUsePatientDetails = usePatientDetails as ReturnType<typeof vi.fn>;

describe('PatientDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading state when data is being fetched', () => {
      mockUsePatientDetails.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Loading patient details...')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should show error state when there is an error', () => {
      const mockError = new Error('Failed to fetch patient');
      const mockRefetch = vi.fn();

      mockUsePatientDetails.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: mockRefetch,
      });

      render(<PatientDetails />);

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load patient details/)).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch patient/)).toBeInTheDocument();

      // Test retry functionality
      fireEvent.click(screen.getByTestId('retry-button'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show error state when patient data is null', () => {
      const mockRefetch = vi.fn();

      mockUsePatientDetails.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<PatientDetails />);

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load patient details/)).toBeInTheDocument();
    });
  });

  describe('Patient details rendering', () => {
    beforeEach(() => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render patient header information', () => {
      render(<PatientDetails />);

      // Use getByRole to find the heading specifically
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
      expect(screen.getByText('Patient ID: patient-123')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<PatientDetails />);

      expect(screen.getByText('Back to Patients')).toBeInTheDocument();
      expect(screen.getByText('Edit Patient')).toBeInTheDocument();

      // Edit button should be disabled
      const editButton = screen.getByText('Edit Patient').closest('button');
      expect(editButton).toBeDisabled();
    });

    it('should handle back navigation', () => {
      render(<PatientDetails />);

      fireEvent.click(screen.getByText('Back to Patients'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should render all tab options', () => {
      render(<PatientDetails />);

      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Encounters')).toBeInTheDocument();
      expect(screen.getByText('Medications')).toBeInTheDocument();
    });
  });

  describe('Patient Details tab', () => {
    beforeEach(() => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should display patient information in the details tab', () => {
      render(<PatientDetails />);

      // Patient details should be visible by default
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      // Check for the name in a table cell specifically
      const tableCells = screen.getAllByText('John Doe');
      expect(tableCells.length).toBeGreaterThan(0);
      expect(screen.getByText('Date of Birth')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('male')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Anytown, USA')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Resource Type')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
    });

    it('should display encounter and medication counts', () => {
      render(<PatientDetails />);

      expect(screen.getByText('Encounter Count')).toBeInTheDocument();
      // Use getAllByText to handle multiple "1" elements
      const oneElements = screen.getAllByText('1');
      expect(oneElements.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Medication Count')).toBeInTheDocument();
    });

    it('should handle null/undefined patient fields gracefully', () => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatientWithoutEncountersOrMedications,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      // Check that N/A is displayed for null fields
      const rows = screen.getAllByText('N/A');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('Encounters tab', () => {
    beforeEach(() => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should switch to encounters tab and display encounter data', async () => {
      render(<PatientDetails />);

      // Click on encounters tab
      fireEvent.click(screen.getByText('Encounters'));

      await waitFor(() => {
        expect(screen.getByText('Patient Encounters')).toBeInTheDocument();
        expect(screen.getByText('Encounter ID:')).toBeInTheDocument();
        expect(screen.getByText('encounter-123')).toBeInTheDocument();
        expect(screen.getByText('Finished')).toBeInTheDocument();
        expect(screen.getByText('Annual checkup')).toBeInTheDocument();
      });
    });

    it('should display message when no encounters exist', async () => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatientWithoutEncountersOrMedications,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      // Click on encounters tab
      fireEvent.click(screen.getByText('Encounters'));

      await waitFor(() => {
        expect(screen.getByText('No encounters found for this patient.')).toBeInTheDocument();
      });
    });
  });

  describe('Medications tab', () => {
    beforeEach(() => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should switch to medications tab and display medication data', async () => {
      render(<PatientDetails />);

      // Click on medications tab
      fireEvent.click(screen.getByText('Medications'));

      await waitFor(() => {
        expect(screen.getByText('Patient Medications')).toBeInTheDocument();
        expect(screen.getByText('Lisinopril 10mg')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Take one tablet by mouth daily')).toBeInTheDocument();
        expect(screen.getByText('Intent:')).toBeInTheDocument();
        expect(screen.getByText('order')).toBeInTheDocument();
      });
    });

    it('should display message when no medications exist', async () => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatientWithoutEncountersOrMedications,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      // Click on medications tab
      fireEvent.click(screen.getByText('Medications'));

      await waitFor(() => {
        expect(screen.getByText('No medications found for this patient.')).toBeInTheDocument();
      });
    });
  });

  describe('Tab navigation', () => {
    beforeEach(() => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should allow switching between tabs', async () => {
      render(<PatientDetails />);

      // Initially on details tab
      expect(screen.getByText('Full Name')).toBeInTheDocument();

      // Switch to encounters tab
      fireEvent.click(screen.getByText('Encounters'));
      await waitFor(() => {
        expect(screen.getByText('Patient Encounters')).toBeInTheDocument();
      });

      // Switch to medications tab
      fireEvent.click(screen.getByText('Medications'));
      await waitFor(() => {
        expect(screen.getByText('Patient Medications')).toBeInTheDocument();
      });

      // Switch back to details tab
      fireEvent.click(screen.getByText('Details'));
      await waitFor(() => {
        expect(screen.getByText('Full Name')).toBeInTheDocument();
      });
    });
  });

  describe('Date formatting', () => {
    it('should format dates correctly', () => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      // Check birth date formatting - use a more flexible approach
      const birthDate = new Date('1990-05-15').toLocaleDateString();
      expect(screen.getByText(birthDate)).toBeInTheDocument();
    });

    it('should handle invalid dates gracefully', () => {
      const patientWithInvalidDate = {
        ...mockPatient,
        birth_date: 'invalid-date',
      };

      mockUsePatientDetails.mockReturnValue({
        data: patientWithInvalidDate,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      // Should still render the component without crashing
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });
  });

  describe('usePatientDetails hook integration', () => {
    it('should call usePatientDetails with correct patient ID', () => {
      mockUsePatientDetails.mockReturnValue({
        data: mockPatient,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<PatientDetails />);

      expect(usePatientDetails).toHaveBeenCalledWith(mockPatientId);
    });
  });
});
