
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as propertyService from "../services/propertyService";

export const fetchProperties = createAsyncThunk(
  "property/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.getProperties();

      if (!response?.success || !Array.isArray(response.properties)) {
        return rejectWithValue(
          response?.message || "Invalid properties response from server."
        );
      }

      return response.properties;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch properties."
      );
    }
  }
);

export const createProperty = createAsyncThunk(
  "property/add",
  async (propertyData, { rejectWithValue }) => {
    try {
      return await propertyService.addProperty(propertyData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add property."
      );
    }
  }
);

export const removeProperty = createAsyncThunk(
  "property/delete",
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete property."
      );
    }
  }
);

const propertySlice = createSlice({
  name: "property",

  initialState: {
    properties: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        if (action.payload?.property) {
          state.properties.unshift(action.payload.property);
        }
      })
      .addCase(removeProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (property) => property.id !== action.payload
        );
      });
  },
});

export default propertySlice.reducer;
