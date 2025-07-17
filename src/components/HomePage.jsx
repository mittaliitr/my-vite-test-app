import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import './HomePage.css'
import Logo from './Logo'

const SOLVED_STORAGE_KEY = "leetcode_solved_problems"

function FancyChevron({ open, style = {}, size = 18 }) {
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
  )
}

export default function HomePage({ problems }) {
  // Solved state per problem
  const [solved, setSolved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SOLVED_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(solved))
  }, [solved])

  const toggleSolved = (number) => {
    setSolved(prev => ({
      ...prev,
      [number]: !prev[number]
    }))
  }

  // Filters and fuzzy search logic
  const [filters, setFilters] = useState({
    number: '',
    title: '',
    tag: '',
    frequency: '',
    companies: '',
    difficulty: '',
  })
  const [search, setSearch] = useState('')

  // Collapsible states
  const [openTags, setOpenTags] = useState({})
  const [openSubTags, setOpenSubTags] = useState({})
  const [openDifficulties, setOpenDifficulties] = useState({})

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

  // -------- NESTED GROUPING LOGIC --------
  // groupedProblems[rootTag][subTag][difficulty] = [problems...]
  const groupedProblems = {};

  searchResults.forEach((problem) => {
    let rootTag = 'Other', subTag = 'General';
    if (problem.tag) {
      const [root, ...rest] = problem.tag.split('/');
      rootTag = root.trim();
      subTag = rest.length > 0 ? rest.join('/').trim() : 'General';
    }
    const difficulty = problem.difficulty || 'Medium';

    if (!groupedProblems[rootTag]) groupedProblems[rootTag] = {};
    if (!groupedProblems[rootTag][subTag]) groupedProblems[rootTag][subTag] = {};
    if (!groupedProblems[rootTag][subTag][difficulty]) groupedProblems[rootTag][subTag][difficulty] = [];
    groupedProblems[rootTag][subTag][difficulty].push(problem);
  });

  const freqOrder = {
    'Very High': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
    'Other': 5,
  };

  Object.keys(groupedProblems).forEach((rootTag) => {
    Object.keys(groupedProblems[rootTag]).forEach((subTag) => {
      Object.keys(groupedProblems[rootTag][subTag]).forEach((difficulty) => {
        groupedProblems[rootTag][subTag][difficulty].sort((a, b) => {
          const fa = freqOrder[a.frequency] || 99
          const fb = freqOrder[b.frequency] || 99
          if (fa !== fb) return fa - fb
          return (a.title || '').localeCompare(b.title || '')
        });
      });
    });
  });

  // Toggle logic for rootTag:
  function handleRootTagToggle(rootTag) {
    setOpenTags(prevOpenTags => {
      const currentlyOpen = !!prevOpenTags[rootTag];

      // If opening (was closed), expand all children
      if (!currentlyOpen) {
        const subTags = Object.keys(groupedProblems[rootTag] || {});
        const newOpenSubTags = { ...openSubTags };
        const newOpenDifficulties = { ...openDifficulties };
        subTags.forEach(subTag => {
          const subKey = `${rootTag}//${subTag}`;
          newOpenSubTags[subKey] = true;
          const difficulties = Object.keys(groupedProblems[rootTag][subTag] || {});
          difficulties.forEach(diff => {
            const diffKey = `${rootTag}//${subTag}//${diff}`;
            newOpenDifficulties[diffKey] = true;
          });
        });
        // Batch set state
        setOpenSubTags(newOpenSubTags);
        setOpenDifficulties(newOpenDifficulties);
      }
      // Toggle the root tag open state
      return { ...prevOpenTags, [rootTag]: !currentlyOpen };
    });
  }

  // Normal toggles for subtag/difficulty
  const toggleSubTag = (rootTag, subTag) => {
    const key = `${rootTag}//${subTag}`;
    setOpenSubTags(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }
  const toggleDifficulty = (rootTag, subTag, difficulty) => {
    const key = `${rootTag}//${subTag}//${difficulty}`;
    setOpenDifficulties(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const totalSolved = Object.values(solved).filter(Boolean).length

  return (
    <div className="center-page">
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

        {/* ====== PROBLEM & SOLVED COUNT ====== */}
        <div style={{ margin: "16px 0", fontWeight: 500 }}>
          Showing <span style={{ color: "#2563eb" }}>{searchResults.length}</span> problem{searchResults.length !== 1 ? "s" : ""}.{' '}
          <span style={{ marginLeft: 16, color: "#16a34a" }}>
            <b>Solved:</b> {totalSolved}
          </span>
        </div>
        {/* ====================================== */}

        {/* --------- NESTED GROUPED DISPLAY ----------- */}
        {Object.keys(groupedProblems)
          .sort()
          .map((rootTag) => (
            <div key={rootTag} className="root-tag-section">
              <div
                className="collapsible-header root-tag-collapsible"
                onClick={() => handleRootTagToggle(rootTag)}
                style={{
                  cursor: 'pointer',
                  fontSize: '1.22em',
                  fontWeight: 600,
                  marginTop: 18,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <FancyChevron open={!!openTags[rootTag]} />
                {rootTag}
              </div>
              {openTags[rootTag] && (
                <div style={{ marginLeft: '1.2em' }}>
                  {Object.keys(groupedProblems[rootTag])
                    .sort()
                    .map((subTag) => {
                      const subKey = `${rootTag}//${subTag}`;
                      return (
                        <div key={subTag} className="subtag-section">
                          <div
                            className="collapsible-header subtag-collapsible"
                            onClick={() => toggleSubTag(rootTag, subTag)}
                            style={{
                              cursor: 'pointer',
                              fontWeight: 500,
                              marginTop: 8,
                              marginBottom: 3,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5
                            }}
                          >
                            <FancyChevron open={!!openSubTags[subKey]} size={15} />
                            {subTag}
                          </div>
                          {openSubTags[subKey] && (
                            <div style={{ marginLeft: '1.2em' }}>
                              {Object.keys(groupedProblems[rootTag][subTag])
                                .sort()
                                .map((difficulty) => {
                                  const difficultyKey = `${rootTag}//${subTag}//${difficulty}`;
                                  const problemsInSection = groupedProblems[rootTag][subTag][difficulty];
                                  return (
                                    <div key={difficulty} className="difficulty-section">
                                      <div
                                        className="collapsible-header difficulty-collapsible"
                                        onClick={() => toggleDifficulty(rootTag, subTag, difficulty)}
                                        style={{
                                          fontWeight: 400,
                                          margin: '10px 0 3px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 5
                                        }}
                                      >
                                        <FancyChevron open={!!openDifficulties[difficultyKey]} size={13} />
                                        {difficulty}
                                      </div>
                                      {openDifficulties[difficultyKey] && (
                                        <table className="problems-table">
                                          <thead>
                                            <tr>
                                              <th>Title</th>
                                              <th>Companies</th>
                                              <th>Solution Summary</th>
                                              <th>Frequency</th>
                                              <th>URL</th>
                                              <th>Solved</th>
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
                                                {/* ==== Solved Checkbox ==== */}
                                                <td>
                                                  <input
                                                    type="checkbox"
                                                    checked={!!solved[problem.number]}
                                                    onChange={() => toggleSolved(problem.number)}
                                                    title="Mark as solved"
                                                  />
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
