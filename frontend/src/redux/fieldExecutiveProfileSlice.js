
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY PROFILE
// =====================================================

export const fetchFieldExecutiveProfile =
  createAsyncThunk(
    "fieldExecutiveProfile/fetchProfile",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/profile`,
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

export const updateFieldExecutiveProfile =
  createAsyncThunk(
    "fieldExecutiveProfile/updateProfile",
    async (profileData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/field/profile`,
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

const fieldExecutiveProfileSlice = createSlice({
  name: "fieldExecutiveProfile",

  initialState: {
    profile: null,
    loading: false,
    updateLoading: false,
    error: null,
    updateSuccess: false,
  },

  reducers: {
    clearFieldExecutiveProfileError: (state) => {
      state.error = null;
    },

    clearFieldExecutiveProfileUpdateSuccess: (
      state
    ) => {
      state.updateSuccess = false;
    },

    clearFieldExecutiveProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH PROFILE
      // =================================================

      .addCase(
        fetchFieldExecutiveProfile.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchFieldExecutiveProfile.fulfilled,
        (state, action) => {
          state.loading = false;

          state.profile =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchFieldExecutiveProfile.rejected,
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
        updateFieldExecutiveProfile.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
          state.updateSuccess = false;
        }
      )

      .addCase(
        updateFieldExecutiveProfile.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          state.profile =
            action.payload?.data ||
            state.profile;

          state.updateSuccess = true;
        }
      )

      .addCase(
        updateFieldExecutiveProfile.rejected,
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
  clearFieldExecutiveProfileError,
  clearFieldExecutiveProfileUpdateSuccess,
  clearFieldExecutiveProfile,
} =
  fieldExecutiveProfileSlice.actions;

export default fieldExecutiveProfileSlice.reducer;

