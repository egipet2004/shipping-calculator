'use client';

import { CarrierName } from '@/types/domain';

interface RatesFiltersProps {
  allCarriers: CarrierName[];
  selectedCarriers: CarrierName[];
  onToggleCarrier: (carrier: CarrierName) => void;
}

export function RatesFilters({ allCarriers, selectedCarriers, onToggleCarrier }: RatesFiltersProps) {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      role="search" 
      aria-label="Filter results"
    >
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        Filter by Carrier
      </h3>
      <div className="flex flex-wrap gap-4">
        {allCarriers.map((carrier) => {
          const isSelected = selectedCarriers.length === 0 || selectedCarriers.includes(carrier);
          return (
            <label 
              key={carrier} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                checked={isSelected}
                onChange={() => onToggleCarrier(carrier)}
                aria-label={`Filter by ${carrier}`}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {carrier}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}