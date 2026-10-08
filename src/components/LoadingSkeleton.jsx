import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 4 }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-poster" />
            <div className="skeleton-body">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="skeleton-hero">
        <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton" style={{ width: '300px', height: '450px', borderRadius: '12px' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-title" style={{ width: '60%', height: '40px', marginBottom: '16px' }} />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
