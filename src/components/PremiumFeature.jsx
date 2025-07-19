// HomePage/PremiumFeature.jsx
import React from "react";

export default function PremiumFeature({ isPremiumUser, children }) {
  if (isPremiumUser) return children;
  return (
    <div className="upgrade-banner">
      <span role="img" aria-label="lock">🔒</span>
      This feature is for premium users only.
      <button
        style={{ marginLeft: 16 }}
        onClick={() => alert("Trigger your upgrade logic here!")}
      >
        Upgrade to Premium
      </button>
    </div>
  );
}
