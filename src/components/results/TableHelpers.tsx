'use client';

import { useState } from 'react';
import { CarrierName } from '@/types/domain';

export function CarrierLogo({ carrier }: { carrier: CarrierName }) {
  const colors: Record<CarrierName, string> = {
    FedEx: 'text-purple-600 bg-purple-50',
    UPS: 'text-yellow-700 bg-yellow-50',
    USPS: 'text-blue-600 bg-blue-50',
    DHL: 'text-red-600 bg-red-50',
  };

  const style = colors[carrier] || 'text-gray-600 bg-gray-50';
  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded font-bold text-xs border ${style}`}>
      {carrier.slice(0, 3).toUpperCase()}
    </div>
  );
}

export function FeaturesList({ features }: { features: string[] }) {
  if (!features || features.length === 0) return <span className="text-gray-400 text-xs">-</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {features.map((feature, idx) => (
        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 border border-gray-200">
          {feature.replace('-', ' ')}
        </span>
      ))}
    </div>
  );
}

interface FeeBreakdownProps {
  baseRate: number;
  fees: { name: string; amount: number }[];
  total: number;
}

export function FeeBreakdown({ baseRate, fees, total }: FeeBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="text-sm">
      <div className="font-bold text-gray-900 flex items-center gap-2">
        ${total.toFixed(2)}
        {fees.length > 0 && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-normal text-blue-600 hover:underline focus:outline-none"
          >
            {isOpen ? 'Hide breakdown' : 'Show breakdown'}
          </button>
        )}
      </div>
      {isOpen && (
        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs space-y-1 animation-fade-in">
          <div className="flex justify-between text-gray-600">
            <span>Base Rate:</span>
            <span>${baseRate.toFixed(2)}</span>
          </div>
          {fees.map((fee, idx) => (
            <div key={idx} className="flex justify-between text-gray-500">
              <span>{fee.name}:</span>
              <span>${fee.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between font-medium">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
