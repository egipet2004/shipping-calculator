'use client';

export function NoRatesFound() {
  return (
    <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-900">No shipping rates found</h3>
      <p className="text-gray-500 mt-2 max-w-sm mx-auto">
        We couldn't find any carriers delivering to this location. Please try adjusting your package details.
      </p>
    </div>
  );
}