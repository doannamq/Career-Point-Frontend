import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Kiểu cho userProfile
interface UserProfile {
  resumeUrl?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  subscription: any;
  phoneNumber?: string;
  companies: string[];
  // thêm field nếu cần
}

// 2. Kiểu cho state
interface UserState {
  userId: string | null;
  email: string | null;
  role: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
}

// 3. initialState có type rõ ràng
const initialState: UserState = {
  userId: null,
  email: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  userProfile: null,
};

// 4. Slice với PayloadAction có type
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        userId: string;
        email: string;
        role: string;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload;
    },
    clearUser: (state) => {
      state.userId = null;
      state.email = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userProfile = null;
    },
  },
});

export const { setUser, setUserProfile, clearUser } = userSlice.actions;

export default userSlice.reducer;
