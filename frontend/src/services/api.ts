import { LoginInput, SignUpInput } from '@/lib/schema'
import axios from 'axios'

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: '/api', // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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
  getProfile: async (userId: string) => {
    try {
      const response = await api.get(`/profile/${userId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }
      throw new Error('Failed to fetch profile: Unknown error');
    }
  }
}