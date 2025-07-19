// HomePage/Sidebar.jsx
import React from "react";

export default function Sidebar({ topics, selected, onSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">Topics</div>
      {topics.map(topic => (
        <div
          key={topic}
          className={`sidebar-topic${selected === topic ? " active" : ""}`}
          onClick={() => onSelect(topic)}
        >
          {topic}
        </div>
      ))}
    </div>
  );
}
