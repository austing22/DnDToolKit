'use client';

import { useSearchParams } from 'next/navigation';

interface Props {
  onResolved: (type: string) => void;
}

export default function TypeFromSearchParams({ onResolved }: Props) {
  const searchParams = useSearchParams();
  const type = searchParams!.get('type') || 'location';

  // Pass the value back up to your parent component
  onResolved(type);

  return null; // doesn't render anything
}
