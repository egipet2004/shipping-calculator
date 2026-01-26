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
    <div className="space-y-6">
      <RatesErrorDisplay errors={data.errors} />
      {data.rates.length > 0 ? (
        <RatesComparisonTable rates={data.rates} />
      ) : (
        <NoRatesFound />
      )}
    </div>
  );
}