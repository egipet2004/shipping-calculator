import { Suspense } from 'react';
import { RateService } from '@/services/rate-service';
import { RateRequest } from '@/types/domain';
import { RatesDisplay } from '@/components/results/RatesDisplay';
import { ResultsSkeletonLoader } from '@/components/results/ResultsSkeletonLoader';
import { SearchParamsTracker } from '@/components/results/SearchParamsTracker';

const mockRequest: RateRequest = {
  origin: {
    name: "Sender Name",
    street1: "123 Origin St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US"
  },
  destination: {
    name: "Receiver Name",
    street1: "456 Dest Ave",
    city: "Beverly Hills",
    state: "CA",
    postalCode: "90210",
    country: "US"
  },
  package: {
    id: "pkg-1",
    type: "box",
    weight: { value: 5, unit: "lbs" },
    dimensions: { length: 10, width: 10, height: 10, unit: "in" },
    declaredValue: 100
  },
  options: {
    speed: "standard",
    signatureRequired: true,
    insurance: true,
    fragileHandling: false,
    saturdayDelivery: false
  }
};

export default function ResultsPage() {
  const service = new RateService();
  const ratesPromise = service.fetchAllRates(mockRequest);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Shipping Rate Comparison
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Real-time rates from FedEx, UPS, and USPS.
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