'use client';
import { useId } from 'react';
import { PackageDimensions, DimensionUnit } from '@/types/domain';

interface DimensionsInputProps {
  value: PackageDimensions;
  onChange: (value: PackageDimensions) => void;
  error?: string;
}

export function DimensionsInput({ value, onChange, error }: DimensionsInputProps) {
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const handleChange = (field: keyof PackageDimensions, newVal: string | number) => {
    onChange({ ...value, [field]: newVal });
  };
  const inputClassName = `w-full rounded-md border p-2 text-gray-900 shadow-sm outline-none transition-all 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
    ${error ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300'}`;
  return (
    <fieldset className="space-y-2 border-none p-0 m-0">
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        Dimensions <span className="text-red-500" aria-hidden="true">*</span>
      </legend>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Length', field: 'length' as const },
          { label: 'Width', field: 'width' as const },
          { label: 'Height', field: 'height' as const }
        ].map(({ label, field }) => (
          <div key={field} className="col-span-1">
            <label htmlFor={`${baseId}-${field}`} className="sr-only">{label}</label>
            <input
              id={`${baseId}-${field}`}
              type="number"
              min="0"
              placeholder={label[0]} 
              aria-label={label}
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={inputClassName}
              value={value[field] || ''}
              onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
            />
          </div>
        ))}
        <div className="col-span-1">
          <label htmlFor={`${baseId}-unit`} className="sr-only">Unit</label>
          <select
            id={`${baseId}-unit`}
            aria-label="Dimension Unit"
            className="w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            value={value.unit}
            onChange={(e) => handleChange('unit', e.target.value as DimensionUnit)}
          >
            <option value="in">in</option>
            <option value="cm">cm</option>
          </select>
        </div>
      </div>
      {error && (
        <p className="flex items-center mt-1 text-red-600 text-sm font-medium" id={errorId} role="alert">
          <svg aria-hidden="true" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </fieldset>
  );
}