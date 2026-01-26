import { RateRequest, RateResponse } from "@/types/domain";

const STORAGE_KEY = 'shipping-rate-results';
const TTL = 1000 * 60 * 30; 

interface StoredResults {
  request: RateRequest;
  response: RateResponse;
  timestamp: number;
}

export function saveResults(request: RateRequest, response: RateResponse): void {
  if (typeof window === 'undefined') return;

  try {
    const data: StoredResults = {
      request,
      response,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save rates to localStorage:', error);
  }
}


export function clearResults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function loadResults(): StoredResults | null {
  if (typeof window === 'undefined') return null;

  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) return null;
  try {
    const data = JSON.parse(rawData) as StoredResults;
    const now = Date.now();
    if (now - data.timestamp > TTL) {
      console.log('Cached rates expired');
      clearResults();
      return null;
    }
    console.log('Loaded rates from cache');
    return data;
  } catch (error) {
    clearResults();
    return null;
  }
}