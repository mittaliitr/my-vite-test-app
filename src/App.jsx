import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import ProblemPage from './components/ProblemPage'
import NewsletterPopup from './components/NewsletterPopup'

export default function App() {
  const [problems, setProblems] = useState([])
  const [email, setEmail] = useState(() => localStorage.getItem("progress_email") || "");
  const [showPopup, setShowPopup] = useState(() => !localStorage.getItem("progress_email"));

  useEffect(() => {
    fetch('/my-vite-test-app/problems.json')
      .then(r => r.json())
      .then(data => setProblems(data))
  }, [])

  // Handle newsletter submit
  const handleNewsletterSubmit = (userEmail) => {
    setEmail(userEmail);
    localStorage.setItem("progress_email", userEmail);
    setShowPopup(false);
  };

  if (!problems.length) return <div>Loading...</div>

  return (
    <>
      <NewsletterPopup
        isOpen={showPopup}
        onSubmit={handleNewsletterSubmit}
        onClose={() => setShowPopup(false)}
      />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage problems={problems} userEmail={email} />} />
          <Route path="/problems/:number" element={<ProblemPage problems={problems} userEmail={email} />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
