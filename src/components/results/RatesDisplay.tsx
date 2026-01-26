'use client';

import { use } from 'react';
import { RateResponse } from "@/types/domain";

interface RatesDisplayProps {
  ratesPromise: Promise<RateResponse>;
}

export function RatesDisplay({ ratesPromise }: RatesDisplayProps) {
  const data = use(ratesPromise);
  const hasErrors = data.errors && data.errors.length > 0;
  return (
    <div className="space-y-6">
      {hasErrors && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-semibold text-yellow-800">Warnings:</h3>
          <ul className="list-disc pl-5 text-yellow-700">
            {data.errors.map((err, idx) => (
              <li key={idx}>{err.carrier}: {err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-4">
        {data.rates.map((rate) => (
          <div key={rate.id} className="p-4 border rounded shadow-sm bg-white hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-lg">{rate.carrier}</span>
                <span className="text-gray-500 ml-2">{rate.serviceName}</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                ${rate.totalCost.toFixed(2)}
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Delivery: {new Date(rate.estimatedDeliveryDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      {data.rates.length === 0 && !hasErrors && (
        <div className="text-center p-10 text-gray-500">
          No rates found.
        </div>
      )}
    </div>
  );
}