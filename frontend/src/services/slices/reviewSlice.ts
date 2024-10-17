import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewApi } from '../api';
import { RootState } from '../store';

interface Review {
  _id: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData: Omit<Review, '_id' | 'createdAt' | 'reviewer'>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const reviewer = state.auth.user?.user?.id;
      console.log('Current state:', state);
      console.log('Reviewer ID:', reviewer);
      if (!reviewer) {
        throw new Error('User not authenticated');
      }
      const response = await reviewApi.createReview({ ...reviewData, reviewer });
      return response.review;
    } catch (error) {
      console.error('Error in createReview thunk:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create review');
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getReviews(userId);
      return response.reviews;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch reviews');
    }
  }
);

export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, reviewData }: { reviewId: string; reviewData: Partial<Review> }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.updateReview(reviewId, reviewData);
      return response.review;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;