import React from 'react';

export default function CustomPropertyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Jagged outer circle / Starburst - refined for more points */}
      <path
        d="M12 2L13.5 4.5L16 3.5L17 6L19.5 6L19.5 8.5L22 9.5L21 12L22 14.5L19.5 15.5L19.5 18L17 18L16 20.5L13.5 19.5L12 22L10.5 19.5L8 20.5L7 18L4.5 18L4.5 15.5L2 14.5L3 12L2 9.5L4.5 8.5L4.5 6L7 6L8 3.5L10.5 4.5L12 2Z"
      />
      {/* Inner vertical lines/pills */}
      <rect x="10" y="10" width="1.5" height="4" rx="0.75" fill="black" />
      <rect x="12.5" y="10" width="1.5" height="4" rx="0.75" fill="black" />
    </svg>
  );
}
