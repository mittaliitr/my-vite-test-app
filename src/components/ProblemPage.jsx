import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import './ProblemPage.css'

export default function ProblemPage({ problems }) {
  const { number } = useParams()
  const problem = problems.find(p => p.number === number)
  const [isJavaSolutionVisible, setJavaSolutionVisible] = useState(false)

  if (!problem) return (
    <div className="problem-not-found">
      <p>Problem not found.</p>
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  )

  return (
    <div className="problem-container">
      <Link to="/" className="back-link">← Back</Link>
      <h2 className="problem-title">#{problem.number} – {problem.title}</h2>

      {/* Approach Section */}
      {problem.approach && (
        <>
          <h3>Approach</h3>
          <p>{problem.approach}</p>
        </>
      )}

      {/* Main Data Structures Section */}
      {problem.mainDataStructures && problem.mainDataStructures.length > 0 && (
        <>
          <h3>Main Data Structures</h3>
          <ul>
            {problem.mainDataStructures.map((ds, index) => (
              <li key={index}>{ds}</li>
            ))}
          </ul>
        </>
      )}

      {/* High-Level Pseudocode Section */}
      {problem.highLevelPseudocode && (
        <>
          <h3>High-Level Pseudocode</h3>
          <SyntaxHighlighter language="text" showLineNumbers>
            {Array.isArray(problem.highLevelPseudocode)
              ? problem.highLevelPseudocode.join('\n')
              : problem.highLevelPseudocode}
          </SyntaxHighlighter>
        </>
      )}

      {/* Java Solution Section */}
      <h3>Java Solution</h3>
      <button
        className="toggle-button"
        onClick={() => setJavaSolutionVisible(!isJavaSolutionVisible)}
      >
        {isJavaSolutionVisible ? 'Hide Java Solution' : 'Show Java Solution'}
      </button>
      {isJavaSolutionVisible && (
        <SyntaxHighlighter language="java" showLineNumbers>
          {problem.code}
        </SyntaxHighlighter>
      )}
    </div>
  )
}