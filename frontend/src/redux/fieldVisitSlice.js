import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFieldVisits,
  getFieldVisit,
  addFieldVisit,
  updateFieldVisit,
  deleteFieldVisit,
} from "../services/fieldVisitService";

// Get All
export const fetchFieldVisits = createAsyncThunk(
  "fieldVisits/fetchFieldVisits",
  async () => {
    return await getFieldVisits();
  }
);

// Get Single
export const fetchFieldVisit = createAsyncThunk(
  "fieldVisits/fetchFieldVisit",
  async (id) => {
    return await getFieldVisit(id);
  }
);

// Add
export const createFieldVisit = createAsyncThunk(
  "fieldVisits/createFieldVisit",
  async (visitData) => {
    return await addFieldVisit(visitData);
  }
);

// Update
export const editFieldVisit = createAsyncThunk(
  "fieldVisits/editFieldVisit",
  async ({ id, visitData }) => {
    return await updateFieldVisit(id, visitData);
  }
);

// Delete
export const removeFieldVisit = createAsyncThunk(
  "fieldVisits/removeFieldVisit",
  async (id) => {
    await deleteFieldVisit(id);
    return id;
  }
);

const fieldVisitSlice = createSlice({
  name: "fieldVisits",

  initialState: {
    visits: [],
    visit: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchFieldVisits.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchFieldVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload.visits || [];
      })

      .addCase(fetchFieldVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single
      .addCase(fetchFieldVisit.fulfilled, (state, action) => {
    state.visit = action.payload.visit;
})

      // Delete
      .addCase(removeFieldVisit.fulfilled, (state, action) => {
        state.visits = state.visits.filter(
          (visit) => visit.id !== action.payload
        );
      });
  },
});

export default fieldVisitSlice.reducer;