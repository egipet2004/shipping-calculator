import { ShippingOptions } from '@/types/domain';
import { ServiceSpeedSelector } from '../fields/ServiceSpeedSelector'; 

interface ShippingOptionsStepProps {
  options: ShippingOptions;
  onChange: (options: ShippingOptions) => void;
}

export function ShippingOptionsStep({ options, onChange }: ShippingOptionsStepProps) {
  const toggleOption = (key: keyof ShippingOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-semibold text-gray-900">Shipping Options</h2>

      <ServiceSpeedSelector 
        selectedSpeed={options.speed} 
        onChange={(speed) => onChange({ ...options, speed })} 
      />

      <div className="space-y-4 pt-4 border-t border-gray-100 mt-6">
        <h3 className="text-sm font-medium text-gray-900">Additional Services</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          
          <label className="flex items-center space-x-3 rounded-md border p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.signatureRequired}
              onChange={() => toggleOption('signatureRequired')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Signature Required</span>
          </label>
          
          <label className="flex items-center space-x-3 rounded-md border p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.fragileHandling}
              onChange={() => toggleOption('fragileHandling')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Fragile Handling</span>
          </label>

          <label className="flex items-center space-x-3 rounded-md border p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.saturdayDelivery}
              onChange={() => toggleOption('saturdayDelivery')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Saturday Delivery</span>
          </label>

          <div className={`rounded-md border p-3 transition-colors ${options.insurance ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
            <label className="flex items-center space-x-3 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.insurance}
                onChange={() => toggleOption('insurance')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Insurance</span>
            </label>
            {options.insurance && (
              <div className="pl-7 animate-in fade-in duration-200">
                <label className="block text-xs text-gray-500 mb-1">Declared Value ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="w-full rounded border border-gray-300 bg-white text-gray-900 p-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={options.insuredValue || ''}
                  onChange={(e) => onChange({...options, insuredValue: parseFloat(e.target.value)})}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}