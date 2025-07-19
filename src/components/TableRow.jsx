// HomePage/TableRow.jsx
import React from "react";
import { Link } from "react-router-dom";
import PremiumFeature from "./PremiumFeature";

export default function TableRow({ problem, isPremiumUser, solved, toggleSolved }) {
  return (
    <tr>
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
      <td>
        <PremiumFeature isPremiumUser={isPremiumUser}>
          <span style={{ color: "#dc2626" }}>Unlocked!</span>
        </PremiumFeature>
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
      <td>
        <input
          type="checkbox"
          checked={!!solved[problem.number]}
          onChange={() => toggleSolved(problem.number)}
          title="Mark as solved"
        />
      </td>
    </tr>
  );
}
