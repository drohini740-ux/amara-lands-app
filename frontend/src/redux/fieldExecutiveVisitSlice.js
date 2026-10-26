
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// Normalize API responses
const getVisits = (response) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.visits)) return data.visits;
  if (Array.isArray(data?.data?.visits)) return data.data.visits;

  return [];
};

const getVisit = (response) => {
  const data = response?.data ?? response;

  return data?.visit ?? data?.data?.visit ?? data?.data ?? null;
};

// FETCH MY VISITS
export const fetchFieldExecutiveVisits = createAsyncThunk(
  "fieldExecutiveVisit/fetchFieldExecutiveVisits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/visits");
      return getVisits(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch visits."
      );
    }
  }
);

// FETCH VISIT BY ID
export const fetchFieldExecutiveVisitById = createAsyncThunk(
  "fieldExecutiveVisit/fetchFieldExecutiveVisitById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/visits/${id}`);
      const visit = getVisit(response.data);

      if (!visit || typeof visit !== "object") {
        return rejectWithValue("Visit details were not found.");
      }

      return visit;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch visit details."
      );
    }
  }
);

// CHECK IN
export const checkInFieldExecutiveVisit = createAsyncThunk(
  "fieldExecutiveVisit/checkInFieldExecutiveVisit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/field/visits/${id}/check-in`, {});
      return getVisit(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to check in to visit."
      );
    }
  }
);

// CHECK OUT
export const checkOutFieldExecutiveVisit = createAsyncThunk(
  "fieldExecutiveVisit/checkOutFieldExecutiveVisit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/field/visits/${id}/check-out`, {});
      return getVisit(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to check out from visit."
      );
    }
  }
);

const initialState = {
  visits: [],
  selectedVisit: null,
  loading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
  detailsError: null,
  actionError: null,
};

const fieldExecutiveVisitSlice = createSlice({
  name: "fieldExecutiveVisit",
  initialState,

  reducers: {
    clearSelectedVisit: (state) => {
      state.selectedVisit = null;
      state.detailsError = null;
    },

    clearVisitError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH VISITS
      .addCase(fetchFieldExecutiveVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchFieldExecutiveVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch visits.";
      })

      // FETCH VISIT BY ID
      .addCase(fetchFieldExecutiveVisitById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchFieldExecutiveVisitById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedVisit = action.payload;
      })
      .addCase(fetchFieldExecutiveVisitById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch visit details.";
      })

      // CHECK IN
      .addCase(checkInFieldExecutiveVisit.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(checkInFieldExecutiveVisit.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedVisit = action.payload;
        if (!updatedVisit || typeof updatedVisit !== "object") return;

        const updatedId = updatedVisit.id ?? updatedVisit.visit_id;

        if (updatedId != null) {
          state.visits = state.visits.map((visit) =>
            (visit.id ?? visit.visit_id) === updatedId
              ? { ...visit, ...updatedVisit }
              : visit
          );
        }

        if (
          state.selectedVisit &&
          (state.selectedVisit.id ?? state.selectedVisit.visit_id) === updatedId
        ) {
          state.selectedVisit = {
            ...state.selectedVisit,
            ...updatedVisit,
          };
        }
      })
      .addCase(checkInFieldExecutiveVisit.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Unable to check in.";
      })

      // CHECK OUT
      .addCase(checkOutFieldExecutiveVisit.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(checkOutFieldExecutiveVisit.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedVisit = action.payload;
        if (!updatedVisit || typeof updatedVisit !== "object") return;

        const updatedId = updatedVisit.id ?? updatedVisit.visit_id;

        if (updatedId != null) {
          state.visits = state.visits.map((visit) =>
            (visit.id ?? visit.visit_id) === updatedId
              ? { ...visit, ...updatedVisit }
              : visit
          );
        }

        if (
          state.selectedVisit &&
          (state.selectedVisit.id ?? state.selectedVisit.visit_id) === updatedId
        ) {
          state.selectedVisit = {
            ...state.selectedVisit,
            ...updatedVisit,
          };
        }
      })
      .addCase(checkOutFieldExecutiveVisit.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Unable to check out.";
      });
  },
});

export const { clearSelectedVisit, clearVisitError } =
  fieldExecutiveVisitSlice.actions;

export default fieldExecutiveVisitSlice.reducer;
