
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// GET TOKEN
// =====================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// RECORD GEO ATTENDANCE
// =====================================================

export const recordGeoAttendance = createAsyncThunk(
  "fieldExecutiveGeoAttendance/recordGeoAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/field/geo-attendance`,
        attendanceData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to record geo attendance."
      );
    }
  }
);

// =====================================================
// GET MY GEO ATTENDANCE
// =====================================================

export const fetchMyGeoAttendance = createAsyncThunk(
  "fieldExecutiveGeoAttendance/fetchMyGeoAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/field/geo-attendance`,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch geo attendance."
      );
    }
  }
);

// =====================================================
// GET GEO ATTENDANCE BY VISIT
// =====================================================

export const fetchGeoAttendanceByVisit =
  createAsyncThunk(
    "fieldExecutiveGeoAttendance/fetchGeoAttendanceByVisit",
    async (visitId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_URL}/field/geo-attendance/visit/${visitId}`,
          getAuthConfig()
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch visit geo attendance."
        );
      }
    }
  );

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  attendance: [],
  visitAttendance: [],
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveGeoAttendanceSlice =
  createSlice({
    name: "fieldExecutiveGeoAttendance",

    initialState,

    reducers: {
      clearGeoAttendanceError: (state) => {
        state.error = null;
      },

      clearVisitAttendance: (state) => {
        state.visitAttendance = [];
      },
    },

    extraReducers: (builder) => {
      // -------------------------------------------------
      // RECORD GEO ATTENDANCE
      // -------------------------------------------------

      builder
        .addCase(
          recordGeoAttendance.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          recordGeoAttendance.fulfilled,
          (state, action) => {
            state.loading = false;

            if (action.payload?.data) {
              state.attendance.unshift(
                action.payload.data
              );
            }
          }
        )

        .addCase(
          recordGeoAttendance.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Unable to record geo attendance.";
          }
        );

      // -------------------------------------------------
      // GET MY GEO ATTENDANCE
      // -------------------------------------------------

      builder
        .addCase(
          fetchMyGeoAttendance.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchMyGeoAttendance.fulfilled,
          (state, action) => {
            state.loading = false;
            state.attendance =
              action.payload?.data || [];
          }
        )

        .addCase(
          fetchMyGeoAttendance.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Unable to fetch geo attendance.";
          }
        );

      // -------------------------------------------------
      // GET GEO ATTENDANCE BY VISIT
      // -------------------------------------------------

      builder
        .addCase(
          fetchGeoAttendanceByVisit.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchGeoAttendanceByVisit.fulfilled,
          (state, action) => {
            state.loading = false;
            state.visitAttendance =
              action.payload?.data || [];
          }
        )

        .addCase(
          fetchGeoAttendanceByVisit.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Unable to fetch visit geo attendance.";
          }
        );
    },
  });

export const {
  clearGeoAttendanceError,
  clearVisitAttendance,
} =
  fieldExecutiveGeoAttendanceSlice.actions;

export default fieldExecutiveGeoAttendanceSlice.reducer;

