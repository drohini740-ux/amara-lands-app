
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// RECORD GEO ATTENDANCE
// =====================================================

export const recordGeoAttendance = createAsyncThunk(
  "fieldExecutiveGeoAttendance/recordGeoAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/field/geo-attendance",
        attendanceData
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Unable to record geo attendance."
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Record Geo Attendance Error:",
        error.response?.data || error.message
      );

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
      const response = await API.get("/field/geo-attendance");

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Unable to fetch geo attendance."
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Fetch Geo Attendance Error:",
        error.response?.data || error.message
      );

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

export const fetchGeoAttendanceByVisit = createAsyncThunk(
  "fieldExecutiveGeoAttendance/fetchGeoAttendanceByVisit",
  async (visitId, { rejectWithValue }) => {
    try {
      if (!visitId) {
        return rejectWithValue("Visit ID is required.");
      }

      const response = await API.get(
        `/field/geo-attendance/visit/${encodeURIComponent(visitId)}`
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message ||
            "Unable to fetch visit geo attendance."
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Fetch Visit Geo Attendance Error:",
        error.response?.data || error.message
      );

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

const fieldExecutiveGeoAttendanceSlice = createSlice({
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
    builder
      // RECORD GEO ATTENDANCE
      .addCase(recordGeoAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordGeoAttendance.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload?.data ?? action.payload;
        const record = payload?.attendance ?? payload;

        if (record && !Array.isArray(record) && record.id != null) {
          state.attendance.unshift(record);
        }
      })
      .addCase(recordGeoAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to record geo attendance.";
      })

      // GET MY GEO ATTENDANCE
      .addCase(fetchMyGeoAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGeoAttendance.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload?.data ?? action.payload;

        state.attendance = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.attendance)
            ? payload.attendance
            : [];
      })
      .addCase(fetchMyGeoAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch geo attendance.";
      })

      // GET GEO ATTENDANCE BY VISIT
      .addCase(fetchGeoAttendanceByVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeoAttendanceByVisit.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload?.data ?? action.payload;

        state.visitAttendance = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.attendance)
            ? payload.attendance
            : payload
              ? [payload]
              : [];
      })
      .addCase(fetchGeoAttendanceByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Unable to fetch visit geo attendance.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearGeoAttendanceError,
  clearVisitAttendance,
} = fieldExecutiveGeoAttendanceSlice.actions;

export default fieldExecutiveGeoAttendanceSlice.reducer;
