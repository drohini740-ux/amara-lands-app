import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminLegalService from "../services/admin/adminLegalService";
export const fetchCaseTracking = createAsyncThunk(
  "adminLegal/fetchCaseTracking",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminLegalService.getCaseTracking();

      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch case tracking"
      );
    }
  }
);
// ==========================================
// Fetch All Legal Cases
// ==========================================

export const fetchAdminLegalCases = createAsyncThunk(
  "adminLegal/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminLegalService.getAdminLegalCases();
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legal cases"
      );
    }
  }
);

// ==========================================
// Fetch Single Legal Case
// ==========================================

export const fetchAdminLegalCase = createAsyncThunk(
  "adminLegal/fetchCase",
  async (id, { rejectWithValue }) => {
    try {
      const res = await adminLegalService.getAdminLegalCase(id);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legal case"
      );
    }
  }
);

// ==========================================
// Update Legal Case
// ==========================================

export const updateAdminLegalCase = createAsyncThunk(
  "adminLegal/updateCase",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await adminLegalService.updateAdminLegalCase(id, data);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update legal case"
      );
    }
  }
);

// ==========================================
// Delete Legal Case
// ==========================================

export const deleteAdminLegalCase = createAsyncThunk(
  "adminLegal/deleteCase",
  async (id, { rejectWithValue }) => {
    try {
      const res = await adminLegalService.deleteAdminLegalCase(id);
      return {
        id,
        ...res,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete legal case"
      );
    }
  }
);

// ==========================================
// Slice
// ==========================================

const adminLegalSlice = createSlice({
  name: "adminLegal",

  initialState: {
    legalCases: [],
    selectedCase: null,
    caseTracking: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedCase: (state) => {
      state.selectedCase = null;
    },

    clearAdminLegalError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // Fetch All
      // ======================================

      .addCase(fetchAdminLegalCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminLegalCases.fulfilled, (state, action) => {
        state.loading = false;
        state.legalCases = action.payload.legalCases || [];
      })

      .addCase(fetchAdminLegalCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // Fetch Single
      // ======================================

      .addCase(fetchAdminLegalCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminLegalCase.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCase = action.payload.legalCase;
      })

      .addCase(fetchAdminLegalCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // Update
      // ======================================

      .addCase(updateAdminLegalCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateAdminLegalCase.fulfilled, (state, action) => {
        state.loading = false;

        const updatedCase = action.payload.legalCase;

        const index = state.legalCases.findIndex(
          (item) => item.id === updatedCase.id
        );

        if (index !== -1) {
          state.legalCases[index] = updatedCase;
        }

        if (state.selectedCase?.id === updatedCase.id) {
          state.selectedCase = updatedCase;
        }
      })

      .addCase(updateAdminLegalCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCaseTracking.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(fetchCaseTracking.fulfilled, (state, action) => {
  state.loading = false;
  state.caseTracking = action.payload.cases || [];
})

.addCase(fetchCaseTracking.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      // ======================================
      // Delete
      // ======================================

      .addCase(deleteAdminLegalCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteAdminLegalCase.fulfilled, (state, action) => {
        state.loading = false;

        state.legalCases = state.legalCases.filter(
          (item) => item.id !== action.payload.id
        );

        if (state.selectedCase?.id === action.payload.id) {
          state.selectedCase = null;
        }
      })

      .addCase(deleteAdminLegalCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedCase,
  clearAdminLegalError,
} = adminLegalSlice.actions;

export default adminLegalSlice.reducer;