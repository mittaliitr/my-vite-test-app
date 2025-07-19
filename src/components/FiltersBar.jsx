// HomePage/FiltersBar.jsx
import React from "react";

export default function FiltersBar({ filters, setFilters, uniqueCompanies, search, setSearch, problems }) {
  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }
  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Fuzzy Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      {Object.keys(filters).map((field) => (
        <div key={field} className="filter-dropdown">
          <label>{field}</label>
          {field === 'companies' ? (
            <select
              value={filters[field]}
              onChange={e => handleFilterChange(field, e.target.value)}
            >
              <option value="">All</option>
              {uniqueCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={filters[field]}
              onChange={e => handleFilterChange(field, e.target.value)}
            >
              <option value="">All</option>
              {[...new Set(problems.map((p) => p[field]))]
                .filter((value) => value)
                .map((value) => (
                  <option key={value} value={value}>
                    {Array.isArray(value) ? value.join(', ') : value}
                  </option>
                ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
