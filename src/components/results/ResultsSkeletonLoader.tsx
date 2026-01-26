'use client';

export function ResultsSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 h-10 w-full border-b border-gray-200"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 flex items-center space-x-4 border-b border-gray-100 last:border-0">
             <div className="h-10 w-10 bg-gray-200 rounded"></div> 
             <div className="flex-1 space-y-2">
               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
               <div className="h-3 bg-gray-100 rounded w-1/3"></div>
             </div>
             <div className="h-8 w-20 bg-gray-200 rounded"></div> 
             <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}