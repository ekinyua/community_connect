import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { profileApi } from "../api";
import { RootState } from "../store";

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

export interface ContactInfo {
  socialMedia: {
    facebook?: string;
    instagram?: string;
  };
  phone?: string;
  website?: string;
}

export interface ProfileData {
  _id: string;
  user: {
    basicProfile: {
      profilePicture: string;
    };
    _id: string;
    username: string;
    email: string;
    userType: string;
  };
  services: string[];
  profilePicture: string;
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  bio?: string;
  location?: string;
  pricing?: string;
  contactInfo: ContactInfo;
}

interface ProfileState {
  currentUserProfile: ProfileData | null;
  viewedProfile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentUserProfile: null,
  viewedProfile: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    if (state.profile.currentUserProfile?.user._id === userId) {
      return state.profile.currentUserProfile;
    }
    try {
      const response = await profileApi.getUserProfile(userId);
      return response.profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user profile"
      );
    }
  }
);

export const fetchCurrentUserProfile = createAsyncThunk(
  "profile/fetchCurrentUserProfile",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    if (state.profile.currentUserProfile) {
      return state.profile.currentUserProfile;
    }
    try {
      const response = await profileApi.getCurrentUserProfile();
      return response.profile;
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch current user profile"
      );
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  "profile/createOrUpdate",
  async (profileData: Partial<ProfileData>, { rejectWithValue }) => {
    try {
      const response = await profileApi.createOrUpdateProfile(profileData);
      return response.profile;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to create/update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<ProfileData>) => {
          state.isLoading = false;
          state.viewedProfile = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error(
          "profileSlice: Error in fetchUserProfile:",
          action.payload
        );
      })
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUserProfile.fulfilled,
        (state, action: PayloadAction<ProfileData>) => {
          state.isLoading = false;
          state.currentUserProfile = action.payload;
        }
      )
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error(
          "profileSlice: Error in fetchCurrentUserProfile:",
          action.payload
        );
      })
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrUpdateProfile.fulfilled,
        (state, action: PayloadAction<ProfileData>) => {
          state.isLoading = false;
          state.currentUserProfile = action.payload;
        }
      )
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearViewedProfile } = profileSlice.actions;
export default profileSlice.reducer;
