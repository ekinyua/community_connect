import { LoginInput, SignUpInput } from '@/lib/schema'
import { Booking, Review } from '@/types';
import axios, { AxiosError } from 'axios'

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error(error)
      return Promise.reject(new Error('Network error. Please check your internet connection. $'))

    }
    // Handle API errors
    console.error(error)
    return Promise.reject(error.response.data)
  }
)

export const authApi = {
  signUp: async (credentials: SignUpInput) => {
    try {
      const response = await api.post('/auth/signup', credentials)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Sign up failed: ${error.message}`)
      }
      throw new Error('Sign up failed: Unknown error')
    }
  },

  login: async (credentials: LoginInput) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error}`)
      }
      throw new Error('Login failed: Unknown error')
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Logout failed: ${error}`)
      }
      throw new Error('Logout failed: Unknown error')
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/current-user'); // Ensure this endpoint matches your backend route
      // console.log(response);
      return response.data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current user: ${error.message}`);
      }
      throw new Error('Failed to fetch current user: Unknown error');
    }
  }
}

export const profileApi = {
  createOrUpdateProfile: async (profileData: unknown) => {
    try {
      const response = await api.post('/profiles/', profileData)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create/update profile: ${error.message}`)
      }
      throw new Error('Failed to create/update profile: Unknown error')
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCurrentUserProfile: async () => {
    try {
      console.log('Fetching current user profile');
      const response = await api.get('/profiles/me');
      console.log('Received current user profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current user profile: ${error.message}`);
      }
      throw new Error('Failed to fetch current user profile: Unknown error');
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      console.log('api: Sending request to fetch user profile:', userId);
      const response = await api.get(`/profiles/user/${userId}`);
      console.log('api: Received response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('api: Error in getUserProfile:', error);
      if (axios.isAxiosError(error)) {
        const axiosError: any = error as AxiosError;
        if (axiosError.response) {
          console.error('Data:', axiosError.response.data);
          console.error('Status:', axiosError.response.status);
          console.error('Headers:', axiosError.response.headers);
          throw new Error(`Failed to fetch user profile: ${axiosError.response.data.message || axiosError.message}`);
        } else if (axiosError.request) {
          console.error('Request:', axiosError.request);
          throw new Error('Failed to fetch user profile: No response received');
        } else {
          console.error('Error:', axiosError.message);
          throw new Error(`Failed to fetch user profile: ${axiosError.message}`);
        }
      } else {
        throw new Error('Failed to fetch user profile: Unknown error');
      }
    }
  }
}

export const bookingApi = {
  createBooking: async (bookingData: Omit<Booking, '_id'>) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
    try {
      const response = await api.put(`/bookings/status`, { bookingId, status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
};

export const reviewApi = {
  createReview: async (reviewData: Omit<Review, '_id' | 'createdAt'>) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error in reviewApi.createReview:', error);
      throw error;
    }
  },

  getReviews: async (userId: string) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  updateReview: async (reviewId: string, reviewData: Partial<Review>) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};

export const chatApi = {
  getMessages: async (userId: string) => {
    try {
      const response = await api.get(`/chat/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (receiverId: string, content: string) => {
    try {
      const response = await api.post('/chat/send', { receiverId, content });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markAsRead: async (messageId: string) => {
    try {
      const response = await api.put(`/chat/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },
};

export const uploadApi = {
  getUploadthingUrl: async () => {
    const response = await api.get('/uploadthing')
    return response.data
  },
}