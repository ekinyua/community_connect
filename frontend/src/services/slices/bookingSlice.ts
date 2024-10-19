import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingApi } from '../api';
import { Booking } from '@/types';


interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

export const bookAppointment = createAsyncThunk(
  'booking/bookAppointment',
  async (bookingData: Omit<Booking, '_id'>, { rejectWithValue }) => {
    try {
      const response = await bookingApi.createBooking(bookingData);
      return response.booking;
    } catch (error) {
      console.error('Error in bookAppointment thunk:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create booking');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getUserBookings();
      return response.bookings;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch bookings');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: Booking['status'] }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.updateBookingStatus(bookingId, status);
      return response.booking;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update booking status');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [] as Booking[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export default bookingSlice.reducer;