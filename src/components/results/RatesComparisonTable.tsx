'use client';

import { useState, useMemo, useCallback } from 'react';
import { ShippingRate, CarrierName } from '@/types/domain';
import { RatesFilters } from './RatesFilters';
import { CarrierLogo, FeaturesList, FeeBreakdown } from './TableHelpers';
import { BestValueBadge } from './BestValueBsdge'; 

interface RatesComparisonTableProps {
  rates: ShippingRate[];
}

type SortField = 'totalCost' | 'estimatedDeliveryDate' | 'carrier';
type SortDirection = 'asc' | 'desc';

export function RatesComparisonTable({ rates }: RatesComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalCost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCarriers, setSelectedCarriers] = useState<CarrierName[]>([]);

  const availableCarriers = useMemo(() => Array.from(new Set(rates.map(r => r.carrier))), [rates]);

  const bestValues = useMemo(() => {
    if (rates.length === 0) return { cheapestId: null, fastestId: null, bestValueId: null };

    const today = new Date().getTime();
    const msPerDay = 1000 * 60 * 60 * 24;

    const getDays = (dateInput: string | Date) => {
      const delivery = new Date(dateInput).getTime();
      return Math.ceil((delivery - today) / msPerDay);
    };

    let cheapest = rates[0];
    let fastest = rates[0];
    let bestValue = rates[0];
    let minScore = Infinity;

    rates.forEach(rate => {
      if (rate.totalCost < cheapest.totalCost) cheapest = rate;
      if (new Date(rate.estimatedDeliveryDate) < new Date(fastest.estimatedDeliveryDate)) fastest = rate;

      const days = getDays(rate.estimatedDeliveryDate);
      const score = rate.totalCost + (days * 2);
      
      if (score < minScore) {
        minScore = score;
        bestValue = rate;
      }
    });

    return { cheapestId: cheapest.id, fastestId: fastest.id, bestValueId: bestValue.id };
  }, [rates]);

  const displayedRates = useMemo(() => {
    let result = [...rates];
    if (selectedCarriers.length > 0) 
      result = result.filter(r => selectedCarriers.includes(r.carrier));

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (sortField === 'estimatedDeliveryDate') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [rates, sortField, sortDirection, selectedCarriers]);

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleCarrierToggle = useCallback((carrier: CarrierName) => {
    setSelectedCarriers(prev => 
      prev.includes(carrier) ? prev.filter(c => c !== carrier) : [...prev, carrier]
    );
  }, []);

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const SortableHeader = ({ field, label }: { field: SortField, label: string }) => {
    const isActive = sortField === field;
    return (
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <button 
          onClick={() => handleSort(field)}
          className="group flex items-center gap-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1"
        >
          {label}
          <span className={`text-gray-400 ${isActive ? 'text-blue-600' : 'opacity-0 group-hover:opacity-50'}`}>
            {isActive && sortDirection === 'desc' ? '↓' : '↑'}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <RatesFilters 
        allCarriers={availableCarriers} 
        selectedCarriers={selectedCarriers} 
        onToggleCarrier={handleCarrierToggle} 
      />
      
      <div 
        className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200"
        role="region" 
        aria-label="Shipping rates comparison table"
        tabIndex={0} 
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="carrier" label="Carrier" />
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <SortableHeader field="estimatedDeliveryDate" label="Delivery" />
              <SortableHeader field="totalCost" label="Cost Breakdown" />
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRates.map((rate) => {
              const isCheapest = rate.id === bestValues.cheapestId;
              const isFastest = rate.id === bestValues.fastestId;
              const isBestValue = rate.id === bestValues.bestValueId;

              return (
                <tr key={rate.id} className={`hover:bg-blue-50 transition-colors ${isBestValue ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <CarrierLogo carrier={rate.carrier} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{rate.carrier}</div>
                        <div className="text-xs text-gray-500">{rate.serviceName}</div>
                        
                        <div className="mt-1 flex flex-col items-start gap-1" aria-label="Badges">
                          {isBestValue && <BestValueBadge type="best-value" />}
                          {isCheapest && !isBestValue && <BestValueBadge type="cheapest" />}
                          {isFastest && !isBestValue && <BestValueBadge type="fastest" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 max-w-xs">
                    <FeaturesList features={rate.features} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(rate.estimatedDeliveryDate)}
                    </div>
                    {rate.guaranteedDelivery && (
                      <span className="text-xs text-green-600 flex items-center" aria-label="Guaranteed delivery">
                        <span aria-hidden="true">✓</span> Guaranteed
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <FeeBreakdown 
                      baseRate={rate.baseRate} 
                      fees={rate.additionalFees.map(f => ({ name: f.type, amount: f.amount }))} 
                      total={rate.totalCost} 
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label={`Select ${rate.carrier} ${rate.serviceName} for $${rate.totalCost}`}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
