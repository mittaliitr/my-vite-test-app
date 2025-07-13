import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import ProblemPage from './components/ProblemPage'

export default function App() {
  const [problems, setProblems] = useState([])

  useEffect(() => {
fetch('/my-vite-test-app/problems.json') // Adjust the path as needed
      .then(r => r.json())
  .then(data => {
        console.log("Fetched problems:", data); // <---- Add this line
        setProblems(data);
      })
  }, [])

  if (!problems.length) return <div>Loading...</div>

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage problems={problems} />} />
        <Route path="/problems/:number" element={<ProblemPage problems={problems} />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}
