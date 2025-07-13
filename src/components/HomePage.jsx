import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import './HomePage.css'

export default function HomePage({ problems }) {
  const [filters, setFilters] = useState({
    number: '',
    title: '',
    tag: '',
    frequency: '',
    companies: '',
    difficulty: '',
  })
  const [search, setSearch] = useState('')

  // Fuzzy search setup
  const fuse = new Fuse(problems, {
    keys: [
      'number',
      'title',
      'tag',
      'frequency',
      'companies',
      'difficulty',
    ],
    threshold: 0.3,
  })

  // Get unique company names for the dropdown
  const uniqueCompanies = [
    ...new Set(problems.flatMap((problem) => problem.companies || [])),
  ]

  const filteredProblems = problems.filter((problem) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true
      if (key === 'companies') {
        return problem.companies?.includes(filters[key])
      }
      if (Array.isArray(problem[key])) {
        return problem[key].some((item) =>
          item.toLowerCase().includes(filters[key].toLowerCase())
        )
      }
      return problem[key]
        .toLowerCase()
        .includes(filters[key].toLowerCase())
    })
  })

  const searchResults = search
    ? fuse.search(search).map((result) => result.item)
    : filteredProblems

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="home-container">
      <h1>Welcome to the Problem Solver</h1>
      <p>Explore problems, learn solutions, and enhance your skills.</p>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Fuzzy Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {Object.keys(filters).map((field) => (
          <div key={field} className="filter-dropdown">
            <label>{field}</label>
            {field === 'companies' ? (
              <select
                value={filters[field]}
                onChange={(e) => handleFilterChange(field, e.target.value)}
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
                onChange={(e) => handleFilterChange(field, e.target.value)}
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
      <table className="problems-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Companies</th>
            <th>Solution Summary</th>
            <th>Frequency</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((problem) => (
            <tr key={problem.number}>
              <td>{problem.number}</td>
              <td>
                <Link to={`/problems/${problem.number}`} className="problem-link">
                  {problem.title}
                </Link>
              </td>
              <td>
                {problem.companies ? (
                  problem.companies.map((company, index) => (
                    <div key={index} className="company-name">
                      {company}
                    </div>
                  ))
                ) : (
                  'N/A'
                )}
              </td>
              <td className="solution-summary">{problem.solution_summary || 'N/A'}</td>
              <td>{problem.frequency}</td>
              <td>
                <a href={problem.url} target="_blank" rel="noopener noreferrer" className="leetcode-link">
                  LeetCode
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}