
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY PROFILE
// =====================================================

export const fetchLegalTeamProfile = createAsyncThunk(
  "legalTeamProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch profile."
      );
    }
  }
);

// =====================================================
// UPDATE MY PROFILE
// =====================================================

export const updateLegalTeamProfile = createAsyncThunk(
  "legalTeamProfile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/legal-team/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    }
  }
);

// =====================================================
// SLICE
// =====================================================

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

      // =================================================
      // FETCH PROFILE
      // =================================================

      .addCase(
        fetchLegalTeamProfile.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLegalTeamProfile.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchLegalTeamProfile.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch profile.";
        }
      )

      // =================================================
      // UPDATE PROFILE
      // =================================================

      .addCase(
        updateLegalTeamProfile.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
          state.updateSuccess = false;
        }
      )

      .addCase(
        updateLegalTeamProfile.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          state.profile =
            action.payload?.data ||
            state.profile;

          state.updateSuccess = true;
        }
      )

      .addCase(
        updateLegalTeamProfile.rejected,
        (state, action) => {
          state.updateLoading = false;

          state.error =
            action.payload ||
            "Failed to update profile.";
        }
      );
  },
});

export const {
  clearProfileError,
  clearProfileUpdateSuccess,
} = legalTeamProfileSlice.actions;

export default legalTeamProfileSlice.reducer;

