import { RateRequest, RateResponse } from "@/types/domain";

export async function fetchRates(request: RateRequest): Promise<RateResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const response = await fetch('http://localhost:3000/api/rates', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request) 
  });

  if (!response.ok) 
    throw new Error(`API Error: ${response.statusText}`);

  return response.json();
}