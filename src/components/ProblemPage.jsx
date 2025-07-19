import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import './ProblemPage.css'

const SOLVED_STORAGE_KEY = "leetcode_solved_problems"
const premiumProblems = [1, 4, 10] // adjust as needed

// Premium wrapper
function PremiumFeature({ isPremiumUser, children }) {
  if (isPremiumUser) return children
  return (
    <div className="upgrade-banner" style={{margin:'16px 0'}}>
      <span role="img" aria-label="lock">🔒</span>
      This section is for premium users only.
      <button
        style={{ marginLeft: 16 }}
        onClick={() => alert("Trigger your upgrade logic here!")}
      >
        Upgrade to Premium
      </button>
    </div>
  )
}

export default function ProblemPage({ problems, userEmail }) {
  const { number } = useParams()
  const problem = problems.find(p => String(p.number) === String(number))
  const [isJavaSolutionVisible, setJavaSolutionVisible] = useState(false)
  const [isPremiumUser, setIsPremiumUser] = useState(false)

  // Progress tied to email
  const storageKey = `${SOLVED_STORAGE_KEY}_${userEmail}`;
  const [solved, setSolved] = useState(() => {
    try {
      const obj = JSON.parse(localStorage.getItem(storageKey)) || {};
      return !!obj[problem?.number]
    } catch {
      return false
    }
  })

  useEffect(() => {
    const onStorage = () => {
      try {
        const obj = JSON.parse(localStorage.getItem(storageKey)) || {};
        setSolved(!!obj[problem?.number])
      } catch {}
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [problem?.number, storageKey])

  const handleSolvedToggle = () => {
    let solvedObj = {}
    try {
      solvedObj = JSON.parse(localStorage.getItem(storageKey)) || {}
    } catch {}
    solvedObj[problem.number] = !solved
    localStorage.setItem(storageKey, JSON.stringify(solvedObj))
    setSolved(!solved)
  }

  if (!problem) return (
    <div className="problem-not-found">
      <p>Problem not found.</p>
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  )

  const isPremiumProblem = premiumProblems.includes(Number(problem.number))

  return (
    <div className="problem-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button
          className={`toggle-premium-btn ${isPremiumUser ? "premium" : ""}`}
          onClick={() => setIsPremiumUser(v => !v)}
        >
          {isPremiumUser ? "Switch to Free" : "Switch to Premium"}
        </button>
      </div>

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

      {/* Approach Section - Premium-gated for some problems */}
      {problem.approach && (
        isPremiumProblem ? (
          <PremiumFeature isPremiumUser={isPremiumUser}>
            <div className="problem-section">
              <h3>Approach</h3>
              <p>{problem.approach}</p>
            </div>
          </PremiumFeature>
        ) : (
          <div className="problem-section">
            <h3>Approach</h3>
            <p>{problem.approach}</p>
          </div>
        )
      )}

      {/* Main Data Structures Section - Premium-gated for some problems */}
      {problem.mainDataStructures && problem.mainDataStructures.length > 0 && (
        isPremiumProblem ? (
          <PremiumFeature isPremiumUser={isPremiumUser}>
            <div className="problem-section">
              <h3>Main Data Structures</h3>
              <ul>
                {problem.mainDataStructures.map((ds, index) => (
                  <li key={index}>{ds}</li>
                ))}
              </ul>
            </div>
          </PremiumFeature>
        ) : (
          <div className="problem-section">
            <h3>Main Data Structures</h3>
            <ul>
              {problem.mainDataStructures.map((ds, index) => (
                <li key={index}>{ds}</li>
              ))}
            </ul>
          </div>
        )
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
