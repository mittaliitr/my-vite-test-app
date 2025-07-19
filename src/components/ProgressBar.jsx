// HomePage/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ solvedCount, totalCount }) {
  const pct = totalCount === 0 ? 0 : Math.round((solvedCount / totalCount) * 100)
  return (
    <div className="progress-bar-container" title={`Progress: ${pct}%`}>
      <div className="progress-bar-fill" style={{width: `${pct}%`}} />
      <span className="progress-bar-label">{solvedCount} / {totalCount} solved</span>
    </div>
  );
}
