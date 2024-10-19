import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import { fetchReviews, createReview } from '@/services/slices/reviewSlice';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface RatingSystemProps {
  userId: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, isLoading, error } = useSelector(
    (state: RootState) => state.review
  );
  const currentUser = useSelector((state: RootState) => state.auth.user?.user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchReviews(userId));
  }, [dispatch, userId]);

  const handleSubmitReview = async () => {
    if (currentUser && currentUser.id) {
      try {
        await dispatch(
          createReview({
            reviewee: userId,
            rating,
            comment,
          })
        ).unwrap();
        setRating(0);
        setComment('');
        toast({
          title: 'Review Submitted',
          description: 'Your review has been successfully submitted.',
        });
      } catch (error: any) {
        console.error('Error submitting review:', error);
        toast({
          title: 'Error',
          description:
            error.message || 'An error occurred while submitting the review.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit a review.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  // Hide the entire component for consumers
  if (currentUser?.userType === 'consumer') return null;

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
        <Button onClick={handleSubmitReview} disabled={!currentUser}>
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default RatingSystem;
