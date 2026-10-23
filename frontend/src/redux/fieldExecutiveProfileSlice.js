
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";



// =====================================================
// FETCH MY PROFILE
// =====================================================

export const fetchFieldExecutiveProfile =
  createAsyncThunk(
    "fieldExecutiveProfile/fetchProfile",
    async (_, { rejectWithValue }) => {
     try {
  const response = await API.get("/field/profile");
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
  const response = await API.put(
    "/field/profile",
    profileData
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

