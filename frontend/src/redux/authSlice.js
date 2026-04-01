import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USER_API = import.meta.env.VITE_USER_API || "http://localhost:7000/api/v1/user";

export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${USER_API}/verify-user`, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User not found");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  verified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.verified = false;
    },
    setVerified: (state) => {
      state.verified = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.verified = true;
      })
      .addCase(verifyUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.verified = true;
      });
  },
});

export const { setLoading, setUser, logoutUser, setVerified } = authSlice.actions;
export default authSlice.reducer;