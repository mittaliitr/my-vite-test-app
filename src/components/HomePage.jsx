import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import './HomePage.css'
import Logo from './Logo'

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
  const [openTags, setOpenTags] = useState({})
  const [openDifficulties, setOpenDifficulties] = useState({})

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
        ? problem[key].toLowerCase().includes(filters[key].toLowerCase())
        : true
    })
  })

  const searchResults = search
    ? fuse.search(search).map((result) => result.item)
    : filteredProblems

  // -------- GROUPING LOGIC ----------
  const groupedProblems = {}

  searchResults.forEach((problem) => {
    const tag = problem.tag || 'Other'
    // Default missing difficulty to "Medium"
    const difficulty = problem.difficulty || 'Medium'
    if (!groupedProblems[tag]) groupedProblems[tag] = {}
    if (!groupedProblems[tag][difficulty]) groupedProblems[tag][difficulty] = []
    groupedProblems[tag][difficulty].push(problem)
  })

  // Frequency order for sorting
  const freqOrder = {
    'Very High': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
    'Other': 5,
  }

  Object.keys(groupedProblems).forEach((tag) => {
    Object.keys(groupedProblems[tag]).forEach((difficulty) => {
      groupedProblems[tag][difficulty].sort((a, b) => {
        const fa = freqOrder[a.frequency] || 99
        const fb = freqOrder[b.frequency] || 99
        if (fa !== fb) return fa - fb
        return (a.title || '').localeCompare(b.title || '')
      })
    })
  })

  // Collapsible handlers
  const toggleTag = (tag) => {
    setOpenTags((prev) => ({ ...prev, [tag]: !prev[tag] }))
  }
  const toggleDifficulty = (tag, difficulty) => {
    setOpenDifficulties((prev) => ({
      ...prev,
      [tag + '-' + difficulty]: !prev[tag + '-' + difficulty],
    }))
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="home-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em', marginBottom: 8 }}>
        <Logo style={{ maxWidth: 220, height: 56 }} />
      </div>
      <p style={{ marginTop: 0, color: '#64748b', fontSize: '1.18em' }}>
        Explore problems, learn solutions, and enhance your skills.
      </p>

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

      {/* ====== PROBLEM COUNT ADDED HERE ====== */}
      <div style={{ margin: "16px 0", fontWeight: 500 }}>
        Showing <span style={{ color: "#2563eb" }}>{searchResults.length}</span> problem{searchResults.length !== 1 ? "s" : ""}.
      </div>
      {/* ====================================== */}

      {/* --------- GROUPED DISPLAY ----------- */}
      {Object.keys(groupedProblems)
        .filter((tag) => tag !== 'Other')
        .sort()
        .map((tag) => (
          <div key={tag} className="tag-section">
            <div
              className="collapsible-header tag-collapsible"
              onClick={() => toggleTag(tag)}
              style={{ cursor: 'pointer' }}
            >
              <span
                className="chevron"
                style={{
                  marginRight: 8,
                  transform: openTags[tag] ? 'rotate(90deg)' : '',
                }}
              >
                ▶
              </span>
              {tag}
            </div>
            {openTags[tag] && (
              <div style={{ marginLeft: '1.2em' }}>
                {Object.keys(groupedProblems[tag])
                  .filter((difficulty) => difficulty !== 'Other')
                  .sort()
                  .map((difficulty) => {
                    const problemsInSection = groupedProblems[tag][difficulty]
                    const isCollapsible = problemsInSection.length > 3
                    const isOpen = openDifficulties[tag + '-' + difficulty]
                    return (
                      <div key={difficulty} className="difficulty-section">
                        <div
                          className="collapsible-header difficulty-collapsible"
                          style={{
                            cursor: isCollapsible ? 'pointer' : 'default',
                          }}
                          onClick={() => {
                            if (isCollapsible) toggleDifficulty(tag, difficulty)
                          }}
                        >
                          {isCollapsible && (
                            <span
                              className="chevron"
                              style={{
                                marginRight: 8,
                                transform: isOpen ? 'rotate(90deg)' : '',
                              }}
                            >
                              ▶
                            </span>
                          )}
                          {difficulty}
                        </div>
                        {(isCollapsible ? isOpen : true) && (
                          <table className="problems-table">
                            <thead>
                              <tr>
                                <th>Title</th>
                                <th>Companies</th>
                                <th>Solution Summary</th>
                                <th>Frequency</th>
                                <th>URL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {problemsInSection.map((problem) => (
                                <tr key={problem.number || problem.title}>
                                  <td>
                                    <Link
                                      to={`/problems/${problem.number || problem.title}`}
                                      className="problem-link"
                                    >
                                      {problem.title}
                                    </Link>
                                  </td>
                                  <td>
                                    {problem.companies && problem.companies.length > 0
                                      ? problem.companies.map((company, idx) => (
                                          <div key={idx} className="company-name">
                                            {company}
                                          </div>
                                        ))
                                      : 'N/A'}
                                  </td>
                                  <td className="solution-summary">
                                    {problem.solution_summary || 'N/A'}
                                  </td>
                                  <td>{problem.frequency}</td>
                                  <td>
                                    <a
                                      href={problem.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="leetcode-link"
                                    >
                                      LeetCode
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        ))}
    </div>
  )
}
