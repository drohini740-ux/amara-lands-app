
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/properties";

// ======================================================
// GET ALL PROPERTIES
// ======================================================
export const fetchSuperAdminProperties = createAsyncThunk(
  "superAdminProperty/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      const data = response.data;

      return (
        data.properties ||
        data.property ||
        data.data?.properties ||
        []
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

// ======================================================
// GET PROPERTY BY ID
// ======================================================
export const fetchSuperAdminPropertyById = createAsyncThunk(
  "superAdminProperty/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/${id}`);
      const data = response.data;

      return data.property || data.data?.property || data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch property"
      );
    }
  }
);

// ======================================================
// VERIFY PROPERTY
// ======================================================
export const verifySuperAdminProperty = createAsyncThunk(
  "superAdminProperty/verify",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}/verify`);
      const data = response.data;

      return data.property || data.data?.property || data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify property"
      );
    }
  }
);

// ======================================================
// REJECT PROPERTY
// ======================================================
export const rejectSuperAdminProperty = createAsyncThunk(
  "superAdminProperty/reject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}/reject`);
      const data = response.data;

      return data.property || data.data?.property || data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject property"
      );
    }
  }
);

// ======================================================
// DELETE PROPERTY
// ======================================================
export const deleteSuperAdminProperty = createAsyncThunk(
  "superAdminProperty/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete property"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================
const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================
const superAdminPropertySlice = createSlice({
  name: "superAdminProperty",
  initialState,
  reducers: {
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
    clearPropertyError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(fetchSuperAdminProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSuperAdminProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // GET BY ID
      .addCase(fetchSuperAdminPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchSuperAdminPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // VERIFY
      .addCase(verifySuperAdminProperty.fulfilled, (state, action) => {
        const updatedProperty = action.payload;
        if (!updatedProperty?.id) return;

        const index = state.properties.findIndex(
          (property) => property.id === updatedProperty.id
        );

        if (index !== -1) {
          state.properties[index] = {
            ...state.properties[index],
            ...updatedProperty,
          };
        }

        if (state.selectedProperty?.id === updatedProperty.id) {
          state.selectedProperty = {
            ...state.selectedProperty,
            ...updatedProperty,
          };
        }
      })
      .addCase(verifySuperAdminProperty.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // REJECT
      .addCase(rejectSuperAdminProperty.fulfilled, (state, action) => {
        const updatedProperty = action.payload;
        if (!updatedProperty?.id) return;

        const index = state.properties.findIndex(
          (property) => property.id === updatedProperty.id
        );

        if (index !== -1) {
          state.properties[index] = {
            ...state.properties[index],
            ...updatedProperty,
          };
        }

        if (state.selectedProperty?.id === updatedProperty.id) {
          state.selectedProperty = {
            ...state.selectedProperty,
            ...updatedProperty,
          };
        }
      })
      .addCase(rejectSuperAdminProperty.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteSuperAdminProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (property) => property.id !== action.payload
        );

        if (state.selectedProperty?.id === action.payload) {
          state.selectedProperty = null;
        }
      })
      .addCase(deleteSuperAdminProperty.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearSelectedProperty,
  clearPropertyError,
} = superAdminPropertySlice.actions;

export default superAdminPropertySlice.reducer;
