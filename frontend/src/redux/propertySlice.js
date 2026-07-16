import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as propertyService from "../services/propertyService";

// ==========================
// Get Properties
// ==========================
export const fetchProperties = createAsyncThunk(
  "property/fetch",
  async () => {
    return await propertyService.getProperties();
  }
);

// ==========================
// Add Property
// ==========================
export const createProperty = createAsyncThunk(
  "property/add",
  async (propertyData) => {
    return await propertyService.addProperty(propertyData);
  }
);

// ==========================
// Delete Property
// ==========================
export const removeProperty = createAsyncThunk(
  "property/delete",
  async (id) => {
    await propertyService.deleteProperty(id);
    return id;
  }
);

const propertySlice = createSlice({
  name: "property",

  initialState: {
    properties: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
      })

      .addCase(fetchProperties.rejected, (state) => {
        state.loading = false;
      })

      // Add Property
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload.property);
      })

      // Delete Property
      .addCase(removeProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (property) => property.id !== action.payload
        );
      });
  },
});

export default propertySlice.reducer;