import React from 'react';

function StatsBar({ counts, total }) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-label">Critical</div>
        <div className="stat-value critical">{counts.critical}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">High</div>
        <div className="stat-value high">{counts.high}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Medium</div>
        <div className="stat-value medium">{counts.medium}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Low</div>
        <div className="stat-value low">{counts.low}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Total</div>
        <div className="stat-value">{total}</div>
      </div>
    </div>
  );
}

export default StatsBar;