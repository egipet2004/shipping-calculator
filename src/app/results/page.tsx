import { Suspense } from 'react';
import { RatesDisplay } from '@/components/results/RatesDisplay';
import { fetchRates } from '@/lib/rates-api';
import { RateRequest } from '@/types/domain';

export default function ResultsPage() {
  const mockRequest: RateRequest = {
    origin: { postalCode: "10001", city: "NY", state: "NY", country: "US", name: "Sender", street1: "123 St" },
    destination: { postalCode: "90210", city: "LA", state: "CA", country: "US", name: "Receiver", street1: "456 St" },
    package: { weight: { value: 5, unit: "lbs" }, dimensions: { length: 10, width: 10, height: 10, unit: "in" }, type: "box", id: "1" },
    options: { speed: "standard", insurance: true, signatureRequired: true, fragileHandling: false, saturdayDelivery: false }
  };

  const ratesPromise = fetchRates(mockRequest);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shipping Rates (React 19 Demo)</h1>
      <Suspense fallback={<ResultsSkeleton />}>
        <RatesDisplay ratesPromise={ratesPromise} />
      </Suspense>
    </div>
  );
}
function ResultsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-gray-200 rounded-md"></div>
      <div className="h-24 bg-gray-200 rounded-md"></div>
      <div className="h-24 bg-gray-200 rounded-md"></div>
    </div>
  );
}