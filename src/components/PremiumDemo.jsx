import React, { useState } from "react";
import "./PremiumDemo.css"; // see CSS below

// Premium feature wrapper
function PremiumFeature({ isPremiumUser, children }) {
  if (isPremiumUser) return children;
  return (
    <div className="upgrade-banner">
      <div>
        <span role="img" aria-label="lock">🔒</span>
        This feature is for premium users only.
      </div>
      <button onClick={() => alert("Upgrade flow here!")}>
        Upgrade to Premium
      </button>
    </div>
  );
}

export default function PremiumDemo() {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  return (
    <div className="premium-demo-container">
      <h1>Welcome to DSA Tracker</h1>

      <div style={{ marginBottom: 22 }}>
        <b>User Type:</b>
        <button
          className={`toggle-premium-btn ${isPremiumUser ? "premium" : ""}`}
          onClick={() => setIsPremiumUser((v) => !v)}
        >
          {isPremiumUser ? "Switch to Free" : "Switch to Premium"}
        </button>
      </div>

      <div className="section">
        <h2>Always Free Content</h2>
        <ul>
          <li>Basic solutions and editorials</li>
          <li>Practice tracking</li>
        </ul>
      </div>

      <PremiumFeature isPremiumUser={isPremiumUser}>
        <div className="section premium-content">
          <h2>🔥 Premium Content</h2>
          <ul>
            <li>Step-by-step detailed explanations</li>
            <li>Exclusive video tutorials</li>
            <li>Ask questions directly to the author</li>
            <li>Advanced time/space analysis</li>
          </ul>
        </div>
      </PremiumFeature>
    </div>
  );
}
