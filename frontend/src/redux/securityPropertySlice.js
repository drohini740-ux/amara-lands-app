
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH ASSIGNED PROPERTIES
// =====================================================

export const fetchSecurityProperties = createAsyncThunk(
  "securityProperty/fetchSecurityProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/security/properties");
      return response.data;
    } catch (error) {
      console.error(
        "Security Properties Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch assigned properties."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  properties: [],
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const securityPropertySlice = createSlice({
  name: "securityProperty",
  initialState,

  reducers: {
    clearSecurityPropertyError: (state) => {
      state.error = null;
    },

    resetSecurityProperties: (state) => {
      state.properties = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSecurityProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};
        const data = payload.data ?? payload;

        state.properties = Array.isArray(data.properties)
          ? data.properties
          : [];
      })

      .addCase(fetchSecurityProperties.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch assigned properties.";
      });
  },
});

export const {
  clearSecurityPropertyError,
  resetSecurityProperties,
} = securityPropertySlice.actions;

export default securityPropertySlice.reducer;
