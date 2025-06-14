import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './api';
import { components } from './schema';

// Export schema types for use in components
export type Patient = components['schemas']['Patient'] & {
  encounters?: Encounter[];
  medications?: MedicationRequest[];
  gender?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type Encounter = {
  resourceType: string;
  id: string;
  status: string;
  period: {
    start?: string;
    end?: string;
  };
  reasonCode?: Array<{
    text?: string;
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
};

export type MedicationRequest = {
  resourceType: string;
  id: string;
  status: string;
  medicationCodeableConcept: {
    text?: string;
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  authoredOn: string;
  intent: string;
  dosageInstruction?: Array<{
    text?: string;
    timing?: {
      repeat?: {
        frequency?: number;
        period?: number;
        periodUnit?: string;
      };
    };
    route?: {
      text?: string;
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
    };
    doseAndRate?: Array<{
      doseQuantity?: {
        value?: number;
        unit?: string;
      };
    }>;
  }>;
};

export type PatientListResponse = {
  patients: Patient[];
};

// Constants
const PATIENTS_ENDPOINT = '/patients/';

// Keys for React Query
export const patientKeys = {
  all: ['patients'] as const,
  list: () => [...patientKeys.all, 'list'] as const,
  search: ({ name, limit }: { name?: string; limit?: number }) =>
    [...patientKeys.list(), { name, limit }] as const,
  detail: (id: string) => [...patientKeys.all, 'detail', id] as const,
};

/**
 * Fetch patients from the API
 */
export const fetchPatients = async (params?: {
  name?: string;
  limit?: number;
}): Promise<PatientListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.name) {
    searchParams.append('name', params.name);
  }
  if (params?.limit) {
    searchParams.append('limit', String(params.limit));
  }

  const queryString = searchParams.toString();
  const url = `${PATIENTS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;

  // The API seems to return an array of Patient objects, so we wrap it in an object
  const patients = await apiRequest<Patient[]>(url);
  return { patients };
};

/**
 * Fetch a single patient's details
 */
export const fetchPatientDetails = async (patientId: string): Promise<Patient> => {
  return apiRequest<Patient>(`${PATIENTS_ENDPOINT}${patientId}`);
};

/**
 * Hook to get patients with optional search parameters
 */
export const usePatients = (params: { name?: string; limit?: number } = {}) => {
  return useQuery({
    queryKey: patientKeys.search(params),
    queryFn: () => fetchPatients(params),
  });
};

/**
 * Hook to get a single patient's details
 */
export const usePatientDetails = (patientId: string) => {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientDetails(patientId),
    enabled: !!patientId,
  });
};
