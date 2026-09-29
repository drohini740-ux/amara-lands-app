import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/legal";

// =====================================================
// GET ALL LEGAL CASES
// =====================================================

export const fetchSuperAdminLegalCases = createAsyncThunk(
  "superAdminLegal/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/cases`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch legal cases."
        );
      }

      return data.cases || [];
    } catch (error) {
      return rejectWithValue(error.message);
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
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch legal case."
        );
      }

      return data.case;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =====================================================
// UPDATE LEGAL CASE STATUS
// =====================================================

export const updateSuperAdminLegalCaseStatus =
  createAsyncThunk(
    "superAdminLegal/updateCaseStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/cases/${id}/status`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update legal case status."
          );
        }

        return data.case;
      } catch (error) {
        return rejectWithValue(error.message);
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
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to delete legal case."
        );
      }

      return data.case;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =====================================================
// GET ALL LEGAL CONSULTATIONS
// =====================================================

export const fetchSuperAdminLegalConsultations =
  createAsyncThunk(
    "superAdminLegal/fetchConsultations",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/consultations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to fetch legal consultations."
          );
        }

        return data.consultations || [];
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// =====================================================
// UPDATE CONSULTATION STATUS
// =====================================================

export const updateSuperAdminConsultationStatus =
  createAsyncThunk(
    "superAdminLegal/updateConsultationStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/consultations/${id}/status`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update consultation status."
          );
        }

        return data.consultation;
      } catch (error) {
        return rejectWithValue(error.message);
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
    // =================================================
    // FETCH CASES
    // =================================================

    builder
      .addCase(
        fetchSuperAdminLegalCases.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminLegalCases.fulfilled,
        (state, action) => {
          state.loading = false;
          state.cases = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminLegalCases.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // FETCH CASE BY ID
    // =================================================

    builder
      .addCase(
        fetchSuperAdminLegalCaseById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminLegalCaseById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedCase = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminLegalCaseById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // UPDATE CASE STATUS
    // =================================================

    builder.addCase(
      updateSuperAdminLegalCaseStatus.fulfilled,
      (state, action) => {
        const updatedCase = action.payload;

        const index = state.cases.findIndex(
          (item) => item.id === updatedCase.id
        );

        if (index !== -1) {
          state.cases[index] = {
            ...state.cases[index],
            status: updatedCase.status,
          };
        }

        if (
          state.selectedCase &&
          state.selectedCase.id === updatedCase.id
        ) {
          state.selectedCase.status =
            updatedCase.status;
        }
      }
    );

    // =================================================
    // DELETE CASE
    // =================================================

    builder.addCase(
      deleteSuperAdminLegalCase.fulfilled,
      (state, action) => {
        const deletedCase = action.payload;

        state.cases = state.cases.filter(
          (item) => item.id !== deletedCase.id
        );

        if (
          state.selectedCase &&
          state.selectedCase.id === deletedCase.id
        ) {
          state.selectedCase = null;
        }
      }
    );

    // =================================================
    // FETCH CONSULTATIONS
    // =================================================

    builder
      .addCase(
        fetchSuperAdminLegalConsultations.pending,
        (state) => {
          state.consultationsLoading = true;
          state.consultationsError = null;
        }
      )

      .addCase(
        fetchSuperAdminLegalConsultations.fulfilled,
        (state, action) => {
          state.consultationsLoading = false;
          state.consultations = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminLegalConsultations.rejected,
        (state, action) => {
          state.consultationsLoading = false;
          state.consultationsError = action.payload;
        }
      );

    // =================================================
    // UPDATE CONSULTATION STATUS
    // =================================================

    builder.addCase(
      updateSuperAdminConsultationStatus.fulfilled,
      (state, action) => {
        const updatedConsultation = action.payload;

        const index = state.consultations.findIndex(
          (item) => item.id === updatedConsultation.id
        );

        if (index !== -1) {
          state.consultations[index] = {
            ...state.consultations[index],
            status: updatedConsultation.status,
          };
        }
      }
    );
  },
});

// =====================================================
// EXPORT
// =====================================================

export const {
  clearSelectedCase,
  clearLegalError,
} = superAdminLegalSlice.actions;

export default superAdminLegalSlice.reducer;