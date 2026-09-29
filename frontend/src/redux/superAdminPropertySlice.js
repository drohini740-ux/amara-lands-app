import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:4000/api/v1/super-admin/properties";

// Get all properties
export const fetchSuperAdminProperties = createAsyncThunk(
  "superAdminProperty/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch properties");
      }

      return data.properties || data.property || data.data?.properties || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get property by ID
export const fetchSuperAdminPropertyById = createAsyncThunk(
  "superAdminProperty/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch property");
      }

      return data.property;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify property
export const verifySuperAdminProperty = createAsyncThunk(
  "superAdminProperty/verify",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/verify`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to verify property");
      }

      return data.property;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reject property
export const rejectSuperAdminProperty = createAsyncThunk(
  "superAdminProperty/reject",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to reject property");
      }

      return data.property;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete property
export const deleteSuperAdminProperty = createAsyncThunk(
  "superAdminProperty/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete property");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

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

      // Get all
      .addCase(fetchSuperAdminProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSuperAdminProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })

      .addCase(fetchSuperAdminProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
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
        state.error = action.payload;
      })

      // Verify
      .addCase(verifySuperAdminProperty.fulfilled, (state, action) => {
        const updatedProperty = action.payload;

        const index = state.properties.findIndex(
          (property) => property.id === updatedProperty.id
        );

        if (index !== -1) {
          state.properties[index].verification_status =
            updatedProperty.verification_status;

          state.properties[index].verified_by =
            updatedProperty.verified_by;
        }

        state.selectedProperty = {
          ...state.selectedProperty,
          ...updatedProperty,
        };
      })

      // Reject
      .addCase(rejectSuperAdminProperty.fulfilled, (state, action) => {
        const updatedProperty = action.payload;

        const index = state.properties.findIndex(
          (property) => property.id === updatedProperty.id
        );

        if (index !== -1) {
          state.properties[index].verification_status =
            updatedProperty.verification_status;

          state.properties[index].verified_by =
            updatedProperty.verified_by;
        }

        state.selectedProperty = {
          ...state.selectedProperty,
          ...updatedProperty,
        };
      })

      // Delete
      .addCase(deleteSuperAdminProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (property) => property.id !== action.payload
        );

        if (state.selectedProperty?.id === action.payload) {
          state.selectedProperty = null;
        }
      })

      // General errors
      .addMatcher(
        (action) =>
          action.type.startsWith("superAdminProperty/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearSelectedProperty,
  clearPropertyError,
} = superAdminPropertySlice.actions;

export default superAdminPropertySlice.reducer;