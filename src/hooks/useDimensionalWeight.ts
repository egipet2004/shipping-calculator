import { useMemo } from 'react';
import { PackageDimensions } from '@/types/domain';

export const useDimensionalWeight = (dimensions: PackageDimensions) => {
  const DIVISOR = dimensions.unit === 'in' ? 139 : 5000;
  const dimensionalWeight = useMemo(() => {
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return 0;
    const volume = length * width * height;
    const weight = volume / DIVISOR;
    return Math.round(weight * 100) / 100;
  }, [dimensions, DIVISOR]);
  return dimensionalWeight;
};