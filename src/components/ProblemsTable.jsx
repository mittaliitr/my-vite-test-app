// HomePage/ProblemsTable.jsx
import React from "react";
import TableRow from "./TableRow";

export default function ProblemsTable({ problems, isPremiumUser, solved, toggleSolved }) {
  return (
    <table className="problems-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Companies</th>
          <th>Solution Summary</th>
          <th>Premium Editorial</th>
          <th>Frequency</th>
          <th>URL</th>
          <th>Solved</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem) => (
          <TableRow
            key={problem.number || problem.title}
            problem={problem}
            isPremiumUser={isPremiumUser}
            solved={solved}
            toggleSolved={toggleSolved}
          />
        ))}
      </tbody>
    </table>
  );
}
