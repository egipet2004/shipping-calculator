import { RateRequest } from '@/types/domain';

const STORAGE_KEY = 'rate-calculator-form-state';

export const saveFormState = (state: RateRequest): void => {
  if (typeof window === 'undefined') return; 
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save form state:', error);
  }
};

export const loadFormState = (): RateRequest | null => {
  if (typeof window === 'undefined') return null;
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as RateRequest;
  } catch (error) {
    console.error('Failed to load form state:', error);
    return null;
  }
};

export const clearFormState = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form state:', error);
  }
};