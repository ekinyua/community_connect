// src/routes/profile/profileId.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, createFileRoute } from '@tanstack/react-router';
import { AppDispatch, RootState } from '@/services/store';
import { fetchProfile } from '@/services/slices/profileSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Star } from 'lucide-react';
import axios from 'axios';


type ProfileParams = {
  profileId: string;
};

interface ProfilePageProps {
  profileId: string;
}

export const Route = createFileRoute('/profile/profileId')({
  component: ProfilePage,
});


function ProfilePage({ profileId }: ProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', service: '' });

  // Get profileId from URL parameters
  // const profileId = useParams({ from: '/profile/profileId'})

  //this one works
  // const { profileId } = Route.useParams<ProfileParams>();

  // const params = Route.useParams();
  // const profileId = params.profileId as string;

  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfile(profileId));
    }
  }, [dispatch, profileId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  const fetchReviews = async (id: string) => {
    try {
      const response = await axios.get(`/api/reviews/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        revieweeId: profileId,
        ...newReview
      });
      fetchReviews(profileId); // Refresh the reviews after submitting
      setNewReview({ rating: 0, comment: '', service: '' }); // Reset the review form
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found.</div>;

  const isServiceProvider = profile.user.userType === 'business' || profile.user.userType === 'artisan';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{profile.user.username}'s Profile</h1>
        <Button onClick={() => navigate({ to: '/' })}>Go Back</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <img
                src={profile.profilePicture || "/default-avatar.png"}
                alt={profile.user.username}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <p><strong>User Type:</strong> {profile.user.userType}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              {isServiceProvider && (
                <>
                  <p><strong>Services:</strong> {profile.services?.join(', ')}</p>
                  <p><strong>Pricing:</strong> {profile.pricing}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {isServiceProvider && (
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.availability?.map((slot, index) => (
                <p key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</p>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Phone:</strong> {profile.contactInfo?.phone}</p>
            <p><strong>Website:</strong> {profile.contactInfo?.website}</p>
            <p><strong>Social Media:</strong></p>
            <ul className="list-disc list-inside pl-4">
              {Object.entries(profile.contactInfo?.socialMedia || {}).map(([platform, link]) => (
                <li key={platform}>{platform}: {link}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <Button className="mt-4 w-full">Book Appointment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.map((review: any) => (
              <div key={review._id} className="mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{review.rating}/5</span>
                </div>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">By: {review.reviewer.username}</p>
              </div>
            ))}
            {user && user.id !== profileId && (
              <form onSubmit={handleReviewSubmit} className="mt-4">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  placeholder="Rating (1-5)"
                  required
                />
                <input
                  type="text"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Comment"
                  required
                />
                <input
                  type="text"
                  value={newReview.service}
                  onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                  placeholder="Service"
                  required
                />
                <Button type="submit">Submit Review</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage; // Ensure the component is exported properly
