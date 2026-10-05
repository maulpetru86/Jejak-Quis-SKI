import React from 'react';

export const HagiaSophiaSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path
      d="M0 220V190L120 190C140 165 180 165 200 190H310V95L318 50L326 95V190H415C425 148 465 135 505 140C530 105 570 95 610 102C635 45 680 22 720 22C760 22 805 45 830 102C870 95 910 105 935 140C975 135 1015 148 1025 190H1114V95L1122 50L1130 95V190H1240C1260 165 1300 165 1320 190H1440V220H0Z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path
      d="M472 195V62L480 18L488 62V195H472ZM952 195V62L960 18L968 62V195H952Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <rect x="311" y="96" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <rect x="473" y="68" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <rect x="473" y="102" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <rect x="953" y="68" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <rect x="953" y="102" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <rect x="1115" y="96" width="14" height="4" rx="2" fill="#F2B705" fillOpacity="0.35" />
    <line x1="720" y1="4" x2="720" y2="24" stroke="#F2B705" strokeWidth="2.5" strokeOpacity="0.55" />
    <circle cx="720" cy="11" r="4" stroke="#F2B705" strokeWidth="2" strokeOpacity="0.65" />
    <g fill="#F2B705" fillOpacity="0.32">
      <rect x="656" y="92" width="6" height="12" rx="3" />
      <rect x="670" y="90" width="6" height="12" rx="3" />
      <rect x="684" y="88" width="6" height="12" rx="3" />
      <rect x="698" y="87" width="6" height="12" rx="3" />
      <rect x="712" y="86" width="6" height="12" rx="3" />
      <rect x="726" y="86" width="6" height="12" rx="3" />
      <rect x="740" y="87" width="6" height="12" rx="3" />
      <rect x="754" y="88" width="6" height="12" rx="3" />
      <rect x="768" y="90" width="6" height="12" rx="3" />
      <rect x="782" y="92" width="6" height="12" rx="3" />
    </g>
  </svg>
);

export const OttomanStarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="6"
      y="6"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      rx="1.5"
    />
    <rect
      x="6"
      y="6"
      width="20"
      height="20"
      transform="rotate(45 16 16)"
      stroke="currentColor"
      strokeWidth="2"
      rx="1.5"
    />
    <circle cx="16" cy="16" r="3.5" fill="currentColor" />
  </svg>
);

export const ArabesqueCorner: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path
      d="M2 2H36C24 8 16 16 12 28C8 16 8 8 2 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <path
      d="M2 2V48M2 2H48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="10" r="2.5" fill="currentColor" />
  </svg>
);
