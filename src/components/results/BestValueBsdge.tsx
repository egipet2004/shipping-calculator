'use client';

type BadgeType = 'cheapest' | 'fastest' | 'best-value';

export function BestValueBadge({ type }: { type: BadgeType }) {
  const styles = {
    'best-value': 'bg-purple-100 text-purple-800 border-purple-200',
    'cheapest': 'bg-green-100 text-green-800 border-green-200',
    'fastest': 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const labels = {
    'best-value': 'BEST VALUE',
    'cheapest': 'CHEAPEST',
    'fastest': 'FASTEST',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}