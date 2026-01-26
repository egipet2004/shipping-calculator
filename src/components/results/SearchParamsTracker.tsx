'use client'; 

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function SearchParamsTracker() {
  const searchParams = useSearchParams();
  useEffect(() => {
  }, [searchParams]);

  return null;
}