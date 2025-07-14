import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import './ProblemPage.css'

const SOLVED_STORAGE_KEY = "leetcode_solved_problems"

export default function ProblemPage({ problems }) {
  const { number } = useParams()
  const problem = problems.find(p => p.number === number)
  const [isJavaSolutionVisible, setJavaSolutionVisible] = useState(false)

  // Solved state (localStorage-backed)
  const [solved, setSolved] = useState(() => {
    try {
      const obj = JSON.parse(localStorage.getItem(SOLVED_STORAGE_KEY)) || {};
      return !!obj[problem?.number]
    } catch {
      return false
    }
  })

  useEffect(() => {
    // Keep state in sync with localStorage changes from other tabs
    const onStorage = () => {
      try {
        const obj = JSON.parse(localStorage.getItem(SOLVED_STORAGE_KEY)) || {};
        setSolved(!!obj[problem?.number])
      } catch {}
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [problem?.number])

  const handleSolvedToggle = () => {
    let solvedObj = {}
    try {
      solvedObj = JSON.parse(localStorage.getItem(SOLVED_STORAGE_KEY)) || {}
    } catch {}
    solvedObj[problem.number] = !solved
    localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(solvedObj))
    setSolved(!solved)
  }

  if (!problem) return (
    <div className="problem-not-found">
      <p>Problem not found.</p>
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  )

  return (
    <div className="problem-container">
      <Link to="/" className="back-link">← Back</Link>
      <div className="problem-title">
        #{problem.number} – {problem.title}
      </div>

      {/* ===== SOLVED TOGGLE ===== */}
      <div style={{ margin: '10px 0' }}>
        <input
          type="checkbox"
          checked={solved}
          onChange={handleSolvedToggle}
          id="solved-toggle"
        />
        <label htmlFor="solved-toggle" style={{ marginLeft: 8 }}>
          {solved ? "Solved" : "Mark as Solved"}
        </label>
      </div>
      {/* ========================= */}

      {/* Problem External URL */}
      {problem.url && (
        <div className="problem-url">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            View Original Problem
          </a>
        </div>
      )}

      {/* Embed URL in iframe */}
      {problem.url && (
        <div className="problem-iframe-container">
          <iframe
            src={problem.url}
            title="Problem Page"
            width="100%"
            height="600px"
            frameBorder="0"
            style={{ borderRadius: '8px', marginBottom: '24px', background: '#fff' }}
          />
          <p style={{ fontSize: '0.9em', color: '#999', marginTop: '8px' }}>
            If the problem doesn’t load here, <a href={problem.url} target="_blank" rel="noopener noreferrer">open it in a new tab</a>.
          </p>
        </div>
      )}

      {/* Approach Section */}
      {problem.approach && (
        <div className="problem-section">
          <h3>Approach</h3>
          <p>{problem.approach}</p>
        </div>
      )}

      {/* Main Data Structures Section */}
      {problem.mainDataStructures && problem.mainDataStructures.length > 0 && (
        <div className="problem-section">
          <h3>Main Data Structures</h3>
          <ul>
            {problem.mainDataStructures.map((ds, index) => (
              <li key={index}>{ds}</li>
            ))}
          </ul>
        </div>
      )}

      {/* High-Level Pseudocode Section */}
      {problem.highLevelPseudocode && (
        <div className="problem-section">
          <h3>High-Level Pseudocode</h3>
          <SyntaxHighlighter language="text">
            {Array.isArray(problem.highLevelPseudocode)
              ? problem.highLevelPseudocode.join('\n')
              : problem.highLevelPseudocode}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Java Solution Section */}
      <div className="problem-section">
        <h3>Java Solution</h3>
        <button
          className="toggle-button"
          onClick={() => setJavaSolutionVisible(!isJavaSolutionVisible)}
        >
          {isJavaSolutionVisible ? 'Hide Java Solution' : 'Show Java Solution'}
        </button>
        {isJavaSolutionVisible && (
          <SyntaxHighlighter language="java">
            {problem.code}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  )
}
