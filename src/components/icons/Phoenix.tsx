import React from 'react';

interface PhoenixIconProps {
  className?: string;
  title?: string;
}

// Simple phoenix-like bird mark
export const PhoenixIcon: React.FC<PhoenixIconProps> = ({ className = 'w-6 h-6', title = 'Phoenix' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    role="img"
    aria-label={title}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M32 6c3 6 7 10 14 12-5 2-9 5-11 9" />
    <path d="M32 6c-3 6-7 10-14 12 5 2 9 5 11 9" />
    <path d="M32 27c-1 6-5 9-9 11 5 1 8 5 9 10" />
    <path d="M32 27c1 6 5 9 9 11-5 1-8 5-9 10" />
    <path d="M32 6c0 18-2 26-10 36" />
    <path d="M32 6c0 18 2 26 10 36" />
    <path d="M22 44c3 3 6 6 10 6s7-3 10-6" />
  </svg>
);
