// Logo.jsx
import React from 'react'

export default function Logo({ style }) {
  return (
    <svg width="200" height="48" viewBox="0 0 230 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <text x="16" y="34" fontFamily="Fira Mono, Menlo, monospace" fontSize="32" fill="#2563eb">{'{'}</text>
      <text x="50" y="34" fontFamily="Fira Mono, Menlo, monospace" fontSize="32" fill="#2563eb">{'}'}</text>
      <polyline points="70,31 78,39 94,21" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <text x="110" y="34" fontFamily="Fira Mono, Menlo, monospace" fontSize="26" fontWeight="bold" fill="#0f172a">
        Problem <tspan fill="#2563eb">Solver</tspan>
      </text>
    </svg>
  )
}
