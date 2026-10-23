
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// FETCH LEGAL TEAM PROFILE
export const fetchLegalTeamProfile = createAsyncThunk(
  "legalTeamProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/legal-team/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

// UPDATE LEGAL TEAM PROFILE
export const updateLegalTeamProfile = createAsyncThunk(
  "legalTeamProfile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put(
        "/legal-team/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  }
);

const legalTeamProfileSlice = createSlice({
  name: "legalTeamProfile",

  initialState: {
    profile: null,
    loading: false,
    updateLoading: false,
    error: null,
    updateSuccess: false,
  },

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfileUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLegalTeamProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLegalTeamProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || action.payload?.profile || null;
      })
      .addCase(fetchLegalTeamProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile.";
      })
      .addCase(updateLegalTeamProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateLegalTeamProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile =
          action.payload?.data ||
          action.payload?.profile ||
          state.profile;
        state.updateSuccess = true;
      })
      .addCase(updateLegalTeamProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to update profile.";
      });
  },
});

export const {
  clearProfileError,
  clearProfileUpdateSuccess,
} = legalTeamProfileSlice.actions;

export default legalTeamProfileSlice.reducer;
