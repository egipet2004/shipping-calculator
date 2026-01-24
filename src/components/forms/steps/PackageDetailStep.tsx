'use client';

import { Package, PackageType } from '@/types/domain';
import { DimensionsInput } from '../fields/DimensionsInput'; 
import { WeightInput } from '../fields/WeightInput'; 
import { useDimensionalWeight } from '@/hooks/useDimensionalWeight';
import { useId } from 'react';

interface PackageDetailsStepProps {
  data: Package;
  onChange: (pkg: Package) => void;
  getFieldError: (field: string) => string | undefined;
}

export function PackageDetailsStep({ data, onChange, getFieldError }: PackageDetailsStepProps) {
  const dimWeight = useDimensionalWeight(data.dimensions);
  const baseId = useId();
  const dimError = getFieldError('dimensions');
  const weightError = getFieldError('weight');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500">
          Enter dimensions and weight to calculate shipping rates.
        </p>
      </div>
      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-gray-700 mb-2">Package Type</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['box', 'envelope', 'tube', 'custom'] as PackageType[]).map((type) => (
            <label
              key={type}
              htmlFor={`${baseId}-${type}`}
              className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all focus-within:ring-2 focus-within:ring-blue-500 ${
                data.type === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                id={`${baseId}-${type}`}
                name="packageType"
                value={type}
                checked={data.type === type}
                onChange={(e) => onChange({ ...data, type: e.target.value as PackageType })}
                className="sr-only"
              />
              <span className="capitalize font-medium text-sm">{type}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <DimensionsInput 
        value={data.dimensions} 
        onChange={(dims) => onChange({ ...data, dimensions: dims })}
        error={dimError} 
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <WeightInput 
          value={data.weight} 
          onChange={(weight) => onChange({ ...data, weight })}
          error={weightError}
        />
        
        <div 
          className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 border border-blue-100 mt-6 md:mt-0"
          aria-live="polite"
        >
          <p className="font-semibold mb-1">Weight Calculation:</p>
          <div className="flex justify-between">
            <span>Actual Weight:</span>
            <span>{data.weight.value} {data.weight.unit}</span>
          </div>
          <div className="flex justify-between">
            <span>Volumetric Weight:</span>
            <span>{dimWeight} {data.weight.unit}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200 font-bold flex justify-between">
            <span>Billable Weight:</span>
            <span>{Math.max(data.weight.value, dimWeight)} {data.weight.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}