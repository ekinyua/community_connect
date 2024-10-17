import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import { fetchReviews, createReview } from '@/services/slices/reviewSlice';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingSystemProps {
  userId: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, isLoading, error } = useSelector((state: RootState) => state.review);
  const currentUser = useSelector((state: RootState) => state.auth.user); // Assume we have the current user in auth state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchReviews(userId));
  }, [dispatch, userId]);

  const handleSubmitReview = () => {
    if (currentUser) {
      dispatch(createReview({
        reviewer: currentUser._id,
        reviewee: userId,
        rating,
        comment
      }));
      setRating(0);
      setComment('');
    } else {
      console.error('No current user found');
      // You might want to show an error message to the user here
    }
  };

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h3>Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="border p-2 rounded">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill={star <= review.rating ? 'gold' : 'none'} />
            ))}
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
      <div>
        <h4>Leave a review</h4>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => setRating(star)}
              fill={star <= rating ? 'gold' : 'none'}
              className="cursor-pointer"
            />
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="mb-2"
        />
        <Button onClick={handleSubmitReview} disabled={!currentUser}>Submit Review</Button>
      </div>
    </div>
  );
};

export default RatingSystem;