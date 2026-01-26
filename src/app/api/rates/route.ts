import { NextResponse } from 'next/server';
import { RateService } from '@/services/rate-service';
import { RateRequest } from '@/types/domain';

export async function POST(request: Request) {
  try {
    const body: RateRequest = await request.json();
    const service = new RateService();
    const data = await service.fetchAllRates(body);
    return NextResponse.json(data);
  } 
  catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch rates', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}