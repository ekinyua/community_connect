import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/services/slices/authSlice'
import profileReducer from '@/services/slices/profileSlice'
import chatReducer from './slices/chatSlice';
import bookingReducer from './slices/bookingSlice';
import reviewReducer from './slices/reviewSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    chat: chatReducer,
    booking: bookingReducer,
    review: reviewReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch