import { PackageWeight, WeightUnit } from '@/types/domain';

interface WeightInputProps {
  value: PackageWeight;
  onChange: (value: PackageWeight) => void;
  error?: string;
}

export function WeightInput({ value, onChange, error }: WeightInputProps) {
  const inputId = 'weight-val';
  const errorId = 'weight-error-msg';

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        Weight <span className="text-red-500" aria-hidden="true">*</span>
      </label>
      
      <div className="flex gap-2">
        <input
          id={inputId}
          name="weight" 
          type="number"
          min="0"
          step="0.1"
          aria-label="Weight value"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`flex-1 rounded-md border p-2 text-gray-900 shadow-sm outline-none transition-all 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
            ${error ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300'}`}
          value={value.value || ''}
          onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
        />
        <select
          aria-label="Weight unit"
          className="w-24 rounded-md border border-gray-300 p-2 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          value={value.unit}
          onChange={(e) => onChange({ ...value, unit: e.target.value as WeightUnit })}
        >
          <option value="lbs">lbs</option>
          <option value="kg">kg</option>
        </select>
      </div>
      
      {error && (
        <div className="flex items-center mt-1 text-red-600" id={errorId} role="alert">
          <svg aria-hidden="true" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
