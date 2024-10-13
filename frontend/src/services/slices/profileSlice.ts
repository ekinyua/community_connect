import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { profileApi } from '../api'

export interface Availability {
  day: string
  startTime: string
  endTime: string
  _id: string
}

export interface ContactInfo {
  socialMedia: {
    facebook?: string
    instagram?: string
  }
  phone?: string
  website?: string
}

export interface ProfileData {
  _id: string
  user: {
    basicProfile: {
      profilePicture: string
    }
    _id: string
    username: string
    email: string
    userType: string
  }
  services: string[]
  profilePicture: string
  availability: Availability[]
  createdAt: string
  updatedAt: string
  __v: number
  bio?: string
  location?: string
  pricing?: string
  contactInfo: ContactInfo
}

interface ProfileState {
  profile: ProfileData | null
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
}

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile(userId)
      return response.profile
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile')
    }
  }
)

export const createOrUpdateProfile = createAsyncThunk(
  'profile/createOrUpdate',
  async (profileData: Partial<ProfileData>, { rejectWithValue }) => {
    try {
      const response = await profileApi.createOrUpdateProfile(profileData)
      return response.profile
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create/update profile')
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default profileSlice.reducer