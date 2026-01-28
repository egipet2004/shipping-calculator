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
        className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer group select-none"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          <span className={`transition-opacity duration-200 ${isActive ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-50'}`}>
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        </div>
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
        className="bg-white rounded-lg shadow-sm border border-gray-100" 
        role="region" 
        aria-label="Shipping rates comparison table"
      >
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <SortableHeader field="carrier" label="Carrier" />
              
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Features
              </th>
              
              <SortableHeader field="estimatedDeliveryDate" label="Delivery" />
              
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer group select-none"
                onClick={() => handleSort('totalCost')}
              >
                 <div className="flex items-center gap-1">
                    Cost Breakdown
                    <span className={`transition-opacity duration-200 ${sortField === 'totalCost' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-50'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                 </div>
              </th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {displayedRates.map((rate) => {
              const isBestValue = rate.id === bestValues.bestValueId;

              return (
                <tr key={rate.id} className={`hover:bg-gray-50 transition-colors ${isBestValue ? 'bg-purple-50/20' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4 h-10 w-10 flex items-center justify-center border border-gray-100 rounded bg-white">
                        <CarrierLogo carrier={rate.carrier} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{rate.carrier}</div>
                        <div className="text-xs text-gray-500">{rate.serviceName}</div>
                        
                        <div className="mt-1 flex flex-wrap gap-1">
                          {isBestValue && <BestValueBadge type="best-value" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 max-w-xs text-sm text-gray-500">
                    <FeaturesList features={rate.features} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(rate.estimatedDeliveryDate)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-bold text-gray-900">${rate.totalCost.toFixed(2)}</span>
                        <FeeBreakdown 
                          baseRate={rate.baseRate} 
                          fees={rate.additionalFees.map(f => ({ name: f.type, amount: f.amount }))} 
                          total={rate.totalCost} 
                        />
                    </div>
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