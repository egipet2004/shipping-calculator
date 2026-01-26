import { Suspense } from 'react';
import { RateService } from '@/services/rate-service';
import { RateRequest } from '@/types/domain';
import { RatesDisplay } from '@/components/results/RatesDisplay';
import { ResultsSkeletonLoader } from '@/components/results/ResultsSkeletonLoader';
import { SearchParamsTracker } from '@/components/results/SearchParamsTracker';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const request: RateRequest = {
    origin: {
      name: "Sender",
      street1: "Origin Address",
      city: (params.fromCity as string) || "New York",
      state: (params.fromState as string) || "NY",
      postalCode: (params.fromZip as string) || "10001",
      country: (params.fromCountry as string) || "US"
    },
    destination: {
      name: "Receiver",
      street1: "Dest Address",
      city: (params.toCity as string) || "Los Angeles",
      state: (params.toState as string) || "CA",
      postalCode: (params.toZip as string) || "90210",
      country: (params.toCountry as string) || "US"
    },
    package: {
      id: "pkg-dynamic",
      type: "box",
      weight: { 
        value: parseFloat(params.weight as string) || 5, 
        unit: (params.weightUnit as 'lbs' | 'kg') || "lbs" 
      },
      dimensions: { 
        length: parseFloat(params.length as string) || 10, 
        width: parseFloat(params.width as string) || 10, 
        height: parseFloat(params.height as string) || 10, 
        unit: (params.dimUnit as 'in' | 'cm') || "in" 
      },
      declaredValue: 100
    },
    options: {
      speed: "standard",
      signatureRequired: params.signature === 'true',
      insurance: params.insurance === 'true',
      fragileHandling: params.fragile === 'true',
      saturdayDelivery: params.saturday === 'true'
    }
  };

  const service = new RateService();
  const ratesPromise = service.fetchAllRates(request);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Shipping Rate Comparison
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Real-time rates based on your package details.
          </p>
        </div>

        <Suspense fallback={<ResultsSkeletonLoader />}>
          <RatesDisplay ratesPromise={ratesPromise} />
          <SearchParamsTracker />
        </Suspense>
      </div>
    </main>
  );
}