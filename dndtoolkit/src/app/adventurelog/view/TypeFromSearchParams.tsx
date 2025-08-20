'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  onResolved: (type: string) => void;
}

export default function TypeFromSearchParams({ onResolved }: Props) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams!.get('type') || '';
    // Pass the value back up to parent component
    onResolved(type);
  }, [searchParams, onResolved]);
  
  return null; // doesn't render anything
}
