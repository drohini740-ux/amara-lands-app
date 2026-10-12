
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH ASSIGNED PROPERTIES
// =====================================================

export const fetchSecurityProperties = createAsyncThunk(
  "securityProperty/fetchSecurityProperties",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/properties`,
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
        state.properties = action.payload?.properties || [];
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

