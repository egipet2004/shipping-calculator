'use client';

import { use } from 'react';
import { RateResponse } from "@/types/domain";
import { RatesComparisonTable } from './RatesComparisonTable';
import { RatesErrorDisplay } from './RatesErrorDisplay'; 
import { NoRatesFound } from './NoRatesFound';           

interface RatesDisplayProps {
  ratesPromise: Promise<RateResponse>;
}

export function RatesDisplay({ ratesPromise }: RatesDisplayProps) {
  const data = use(ratesPromise);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RatesErrorDisplay errors={data.errors} />
      {data.rates.length > 0 ? (
        <RatesComparisonTable rates={data.rates} />
      ) : (
        <NoRatesFound />
      )}
    </div>
  );
}