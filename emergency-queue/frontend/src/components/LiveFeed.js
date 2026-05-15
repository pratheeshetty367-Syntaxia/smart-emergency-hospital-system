import React from 'react';

const TYPE_COLOR = {
  admit:     '#2ed573',
  alert:     '#ff4757',
  discharge: '#00b4d8',
  info:      '#7a9ab8',
};

export default function LiveFeed({ feed }) {
  return (
    <div className="live-feed">
      <div className="lf-header">
        <span className="lf-title">Live Activity Feed</span>
        <span className="live-dot-sm">●</span>
      </div>
      <div className="lf-body">
        {feed.length === 0 && <div className="lf-empty">Admit a patient to see live events...</div>}
        {feed.map(e => (
          <div key={e.id} className="lf-item">
            <span className="lf-time">{e.time}</span>
            <span className="lf-msg" style={{color: TYPE_COLOR[e.type] || '#b0c4d8'}}>{e.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}