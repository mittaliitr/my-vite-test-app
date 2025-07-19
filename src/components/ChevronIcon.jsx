// HomePage/ChevronIcon.jsx
import React from "react";

export default function ChevronIcon({ open, size = 18, style = {} }) {
  return (
    <svg
      style={{
        transition: 'transform 0.2s',
        transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
        verticalAlign: 'middle',
        ...style,
      }}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <polyline
        points="6 8 10 12 14 8"
        stroke="#6366f1"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
