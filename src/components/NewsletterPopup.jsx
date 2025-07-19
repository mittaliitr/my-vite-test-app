import React, { useState } from "react";
import "./NewsletterPopup.css"; // Reuse your CSS, or rename as needed

export default function NewsletterPopup({ onSubmit, isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    localStorage.setItem("progress_email", email);
    setTimeout(() => {
      if (onSubmit) onSubmit(email);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="newsletter-popup-backdrop">
      <div className="newsletter-popup">
        <button className="close-btn" onClick={onClose} title="Close">×</button>
        <div className="newsletter-logo" style={{marginBottom: 12}}>
          <span role="img" style={{fontSize:"54px"}} aria-label="logo">📊</span>
        </div>
        <h2 className="newsletter-title" style={{fontWeight: 900, fontSize: "2rem"}}>
          <u>Sign In to Track Progress</u>
        </h2>
        <p className="newsletter-sub" style={{marginBottom: 10}}>
          Track which problems you’ve solved, save your streak,<br />
          and sync progress with your email. No spam, promise!
        </p>
        <div className="newsletter-meta" style={{marginBottom: 16, color: "#4f4f4f"}}>
          <b>Free, secure & always private</b>
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email…"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <button type="submit">Continue</button>
          </form>
        ) : (
          <div className="newsletter-success">
            ✅ Signed in! You can now track your progress.
          </div>
        )}
        {error && <div className="newsletter-error">{error}</div>}
        <div className="newsletter-terms">
          We respect your privacy. <a href="#">Learn more</a>
        </div>
        <div className="newsletter-powered">
          <span style={{fontSize: "13px", color: "#aaa"}}>
            Powered by <b>DSA Tracker</b>
          </span>
        </div>
      </div>
    </div>
  );
}
