import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getConsultations,
  getConsultation,
  addConsultation,
  updateConsultation,
  deleteConsultation,
} from "../services/consultationService";

// Get All
export const fetchConsultations = createAsyncThunk(
  "consultations/fetchConsultations",
  async () => {
    return await getConsultations();
  }
);

// Get Single
export const fetchConsultation = createAsyncThunk(
  "consultations/fetchConsultation",
  async (id) => {
    return await getConsultation(id);
  }
);

// Add
export const createConsultation = createAsyncThunk(
  "consultations/createConsultation",
  async (consultationData) => {
    return await addConsultation(consultationData);
  }
);

// Update
export const editConsultation = createAsyncThunk(
  "consultations/editConsultation",
  async ({ id, consultationData }) => {
    return await updateConsultation(id, consultationData);
  }
);

// Delete
export const removeConsultation = createAsyncThunk(
  "consultations/removeConsultation",
  async (id) => {
    await deleteConsultation(id);
    return id;
  }
);

const consultationSlice = createSlice({
  name: "consultations",

  initialState: {
    consultations: [],
    consultation: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload.consultations || [];
      })

      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchConsultation.fulfilled, (state, action) => {
        state.consultation = action.payload.consultation;
      })

      .addCase(removeConsultation.fulfilled, (state, action) => {
        state.consultations = state.consultations.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default consultationSlice.reducer;