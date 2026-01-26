'use client';

import { CarrierError } from "@/types/domain"; 

export function RatesErrorDisplay({ errors }: { errors: CarrierError[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
      <h3 className="font-semibold text-yellow-800 text-sm mb-2">Partial System Warnings:</h3>
      <ul className="list-disc pl-5 text-yellow-700 text-sm space-y-1">
        {errors.map((err, idx) => (
          <li key={idx}>
            <span className="font-bold">{err.carrier}:</span> {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
}