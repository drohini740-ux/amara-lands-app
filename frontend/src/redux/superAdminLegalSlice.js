
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/legal";

// =====================================================
// GET ALL LEGAL CASES
// =====================================================
export const fetchSuperAdminLegalCases = createAsyncThunk(
  "superAdminLegal/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/cases`);
      const data = response.data;

      return data.cases || data.data?.cases || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legal cases."
      );
    }
  }
);

// =====================================================
// GET LEGAL CASE BY ID
// =====================================================
export const fetchSuperAdminLegalCaseById = createAsyncThunk(
  "superAdminLegal/fetchCaseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/cases/${id}`);
      const data = response.data;

      return data.case || data.data?.case || data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legal case."
      );
    }
  }
);

// =====================================================
// UPDATE LEGAL CASE STATUS
// =====================================================
export const updateSuperAdminLegalCaseStatus = createAsyncThunk(
  "superAdminLegal/updateCaseStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/cases/${id}/status`,
        { status }
      );
      const data = response.data;

      return data.case || data.data?.case || data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update legal case status."
      );
    }
  }
);

// =====================================================
// DELETE LEGAL CASE
// =====================================================
export const deleteSuperAdminLegalCase = createAsyncThunk(
  "superAdminLegal/deleteCase",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${API_URL}/cases/${id}`);
      const data = response.data;

      return data.case || data.data?.case || { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete legal case."
      );
    }
  }
);

// =====================================================
// GET ALL LEGAL CONSULTATIONS
// =====================================================
export const fetchSuperAdminLegalConsultations = createAsyncThunk(
  "superAdminLegal/fetchConsultations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/consultations`);
      const data = response.data;

      return data.consultations || data.data?.consultations || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch legal consultations."
      );
    }
  }
);

// =====================================================
// UPDATE CONSULTATION STATUS
// =====================================================
export const updateSuperAdminConsultationStatus = createAsyncThunk(
  "superAdminLegal/updateConsultationStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/consultations/${id}/status`,
        { status }
      );
      const data = response.data;

      return (
        data.consultation ||
        data.data?.consultation ||
        data.data ||
        data
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update consultation status."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  cases: [],
  consultations: [],
  selectedCase: null,
  loading: false,
  consultationsLoading: false,
  error: null,
  consultationsError: null,
};

// =====================================================
// SLICE
// =====================================================
const superAdminLegalSlice = createSlice({
  name: "superAdminLegal",
  initialState,

  reducers: {
    clearSelectedCase: (state) => {
      state.selectedCase = null;
    },

    clearLegalError: (state) => {
      state.error = null;
      state.consultationsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH CASES
      .addCase(fetchSuperAdminLegalCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminLegalCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSuperAdminLegalCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // FETCH CASE BY ID
      .addCase(fetchSuperAdminLegalCaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminLegalCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCase = action.payload;
      })
      .addCase(fetchSuperAdminLegalCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE CASE STATUS
      .addCase(
        updateSuperAdminLegalCaseStatus.fulfilled,
        (state, action) => {
          const updatedCase = action.payload;
          if (!updatedCase?.id) return;

          const index = state.cases.findIndex(
            (item) => item.id === updatedCase.id
          );

          if (index !== -1) {
            state.cases[index] = {
              ...state.cases[index],
              ...updatedCase,
            };
          }

          if (state.selectedCase?.id === updatedCase.id) {
            state.selectedCase = {
              ...state.selectedCase,
              ...updatedCase,
            };
          }
        }
      )

      // DELETE CASE
      .addCase(deleteSuperAdminLegalCase.fulfilled, (state, action) => {
        const deletedCase = action.payload;
        const deletedId =
          deletedCase && typeof deletedCase === "object"
            ? deletedCase.id
            : deletedCase;

        state.cases = state.cases.filter(
          (item) => item.id !== deletedId
        );

        if (state.selectedCase?.id === deletedId) {
          state.selectedCase = null;
        }
      })

      // FETCH CONSULTATIONS
      .addCase(fetchSuperAdminLegalConsultations.pending, (state) => {
        state.consultationsLoading = true;
        state.consultationsError = null;
      })
      .addCase(
        fetchSuperAdminLegalConsultations.fulfilled,
        (state, action) => {
          state.consultationsLoading = false;
          state.consultations = Array.isArray(action.payload)
            ? action.payload
            : [];
        }
      )
      .addCase(
        fetchSuperAdminLegalConsultations.rejected,
        (state, action) => {
          state.consultationsLoading = false;
          state.consultationsError =
            action.payload || action.error.message;
        }
      )

      // UPDATE CONSULTATION STATUS
      .addCase(
        updateSuperAdminConsultationStatus.fulfilled,
        (state, action) => {
          const updatedConsultation = action.payload;
          if (!updatedConsultation?.id) return;

          const index = state.consultations.findIndex(
            (item) => item.id === updatedConsultation.id
          );

          if (index !== -1) {
            state.consultations[index] = {
              ...state.consultations[index],
              ...updatedConsultation,
            };
          }
        }
      )
      .addCase(
        updateSuperAdminConsultationStatus.rejected,
        (state, action) => {
          state.consultationsError =
            action.payload || action.error.message;
        }
      )
      .addCase(
        updateSuperAdminLegalCaseStatus.rejected,
        (state, action) => {
          state.error = action.payload || action.error.message;
        }
      )
      .addCase(deleteSuperAdminLegalCase.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearSelectedCase,
  clearLegalError,
} = superAdminLegalSlice.actions;

export default superAdminLegalSlice.reducer;
