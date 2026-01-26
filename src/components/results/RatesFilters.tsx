'use client';

import { CarrierName } from "@/types/domain";

interface RatesFiltersProps {
  allCarriers: CarrierName[];          
  selectedCarriers: CarrierName[];     
  onToggleCarrier: (carrier: CarrierName) => void;
}

export function RatesFilters({ allCarriers, selectedCarriers, onToggleCarrier }: RatesFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
        Filter by Carrier
      </h3>
      <div className="flex flex-wrap gap-4">
        {allCarriers.map((carrier) => {
          const isSelected = selectedCarriers.length === 0 || selectedCarriers.includes(carrier);
          
          return (
            <label key={carrier} className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={isSelected}
                onChange={() => onToggleCarrier(carrier)}
              />
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {carrier}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}