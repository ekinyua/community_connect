import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '../api';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface MessagePreview {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  messageList: MessagePreview[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  messageList: [],
  isLoading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await chatApi.getMessages(userId);
      return response.messages;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch messages');
    }
  }
);

export const fetchMessageList = createAsyncThunk(
  'chat/fetchMessageList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getMessageList();
      return response.messageList; 
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch message list');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, content }: { receiverId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(receiverId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(fetchMessageList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessageList.fulfilled, (state, action: PayloadAction<MessagePreview[]>) => {
        state.isLoading = false;
        state.messageList = action.payload;
      })
      .addCase(fetchMessageList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;