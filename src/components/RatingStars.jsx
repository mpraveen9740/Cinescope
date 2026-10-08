import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, max = 10, size = 16, showNumber = true, interactive = false, onRate }) => {
  const normalized = (rating / max) * 5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    if (normalized >= val) return 'full';
    if (normalized >= val - 0.5) return 'half';
    return 'empty';
  });

  return (
    <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {stars.map((type, i) => (
        <span
          key={i}
          onClick={() => interactive && onRate && onRate((i + 1) * 2)}
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.15s' }}
          className={interactive ? 'star-interactive' : ''}
        >
          <Star
            size={size}
            fill={type !== 'empty' ? '#f59e0b' : 'none'}
            color={type !== 'empty' ? '#f59e0b' : '#4b5563'}
            strokeWidth={1.5}
          />
        </span>
      ))}
      {showNumber && (
        <span style={{ marginLeft: '6px', fontSize: size * 0.875, color: '#d1d5db', fontWeight: 600 }}>
          {typeof rating === 'number' ? rating.toFixed(1) : rating}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
