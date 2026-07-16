import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboard } from "../services/dashboardService";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async () => {
    const response = await getDashboard();
    return response.dashboard;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    data: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});

export default dashboardSlice.reducer;