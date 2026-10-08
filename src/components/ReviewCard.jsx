import React from 'react';
import { ThumbsUp } from 'lucide-react';
import RatingStars from './RatingStars';

const ReviewCard = ({ review, onLike, onDelete, currentUserId }) => {
  const isOwner = review.userId === currentUserId || review.user_id === currentUserId;

  return (
    <div className="review-card">
      <div className="review-header">
        <img
          src={review.avatar || review.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username || review.user_id}`}
          alt={review.username || 'User'}
          className="review-avatar"
          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.username || 'U'}`; }}
        />
        <div className="review-meta">
          <span className="review-username">{review.username || review.profiles?.username || 'Anonymous'}</span>
          <span className="review-date">{review.date || (review.created_at && new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))}</span>
        </div>
        <div className="review-rating-wrap">
          <RatingStars rating={review.rating} max={10} size={14} />
        </div>
      </div>

      <p className="review-text">{review.text || review.review_text}</p>

      <div className="review-footer">
        <button
          className={`like-btn ${review.likedByUser ? 'liked' : ''}`}
          onClick={() => onLike?.(review.id)}
        >
          <ThumbsUp size={14} />
          <span>{review.likes || 0}</span>
        </button>

        {isOwner && (
          <button className="delete-review-btn" onClick={() => onDelete?.(review.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
