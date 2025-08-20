'use client';

import Image from 'next/image';

interface LoaderProps {
  size?: number;   // allow optional size override
}

export default function Loader({ size = 80 }: LoaderProps) {
  return (
    <div className="flex justify-center items-center py-8">
      <Image
        src="/images/loading_image.gif"  
        alt="Loading..."
        width={size}
        height={size}
        unoptimized
      />
    </div>
  );
}
