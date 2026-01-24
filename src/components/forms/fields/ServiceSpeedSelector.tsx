'use client';

import { useId } from 'react';
import { ServiceSpeed } from '@/types/domain';

interface ServiceSpeedSelectorProps {
  selectedSpeed: ServiceSpeed;
  onChange: (speed: ServiceSpeed) => void;
}

const speeds: ServiceSpeed[] = ['overnight', 'two-day', 'standard', 'economy'];
export function ServiceSpeedSelector({ selectedSpeed, onChange }: ServiceSpeedSelectorProps) {
  const baseId = useId();

  return (
    <fieldset className="space-y-3 border-none p-0 m-0">
      <legend className="block text-sm font-medium text-gray-700 mb-2">Service Speed</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup">
        {speeds.map((speed) => {
          const id = `${baseId}-${speed}`;
          const isChecked = selectedSpeed === speed;
          
          return (
            <label
              key={speed}
              htmlFor={id}
              className={`relative cursor-pointer rounded-lg border p-4 text-center transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                isChecked
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                id={id}
                name="service-speed"
                value={speed}
                checked={isChecked}
                onChange={() => onChange(speed)}
                className="sr-only" 
              />
              <span className="block font-semibold capitalize">{speed.replace('-', ' ')}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}