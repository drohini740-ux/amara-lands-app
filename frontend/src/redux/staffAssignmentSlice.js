import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// GET ALL STAFF ASSIGNMENTS
// =====================================================
export const fetchStaffAssignments = createAsyncThunk(
  "staffAssignment/fetchStaffAssignments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await API.get("/admin/staff-assignments", {
        params,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch staff assignments"
      );
    }
  }
);

// =====================================================
// GET AVAILABLE STAFF
// =====================================================
export const fetchAvailableStaff = createAsyncThunk(
  "staffAssignment/fetchAvailableStaff",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(
        "/admin/staff-assignments/staff"
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch available staff"
      );
    }
  }
);

// =====================================================
// GET AVAILABLE PROPERTIES
// =====================================================
export const fetchAvailableProperties = createAsyncThunk(
  "staffAssignment/fetchAvailableProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(
        "/admin/staff-assignments/properties"
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch available properties"
      );
    }
  }
);

// =====================================================
// GET SINGLE ASSIGNMENT
// =====================================================
export const fetchStaffAssignmentById = createAsyncThunk(
  "staffAssignment/fetchStaffAssignmentById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/admin/staff-assignments/${id}`
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch assignment"
      );
    }
  }
);

// =====================================================
// CREATE ASSIGNMENT
// =====================================================
export const createStaffAssignment = createAsyncThunk(
  "staffAssignment/createStaffAssignment",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/admin/staff-assignments",
        assignmentData
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create staff assignment"
      );
    }
  }
);

// =====================================================
// UPDATE ASSIGNMENT
// =====================================================
export const updateStaffAssignment = createAsyncThunk(
  "staffAssignment/updateStaffAssignment",
  async (
    { id, assignmentData },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.put(
        `/admin/staff-assignments/${id}`,
        assignmentData
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update staff assignment"
      );
    }
  }
);

// =====================================================
// DELETE ASSIGNMENT
// =====================================================
export const deleteStaffAssignment = createAsyncThunk(
  "staffAssignment/deleteStaffAssignment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(
        `/admin/staff-assignments/${id}`
      );

      return {
        id,
        ...res.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete staff assignment"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  assignments: [],
  staff: [],
  properties: [],
  selectedAssignment: null,

  loading: false,
  staffLoading: false,
  propertiesLoading: false,
  actionLoading: false,

  error: null,
  success: false,
  message: "",
};

// =====================================================
// SLICE
// =====================================================
const staffAssignmentSlice = createSlice({
  name: "staffAssignment",
  initialState,

  reducers: {
    clearStaffAssignmentError: (state) => {
      state.error = null;
    },

    clearStaffAssignmentMessage: (state) => {
      state.message = "";
      state.success = false;
    },

    clearSelectedAssignment: (state) => {
      state.selectedAssignment = null;
    },
  },

  extraReducers: (builder) => {

    // =================================================
    // FETCH ASSIGNMENTS
    // =================================================
    builder
      .addCase(
        fetchStaffAssignments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStaffAssignments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.assignments =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchStaffAssignments.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // FETCH AVAILABLE STAFF
    // =================================================
    builder
      .addCase(
        fetchAvailableStaff.pending,
        (state) => {
          state.staffLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAvailableStaff.fulfilled,
        (state, action) => {
          state.staffLoading = false;
          state.staff =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchAvailableStaff.rejected,
        (state, action) => {
          state.staffLoading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // FETCH AVAILABLE PROPERTIES
    // =================================================
    builder
      .addCase(
        fetchAvailableProperties.pending,
        (state) => {
          state.propertiesLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAvailableProperties.fulfilled,
        (state, action) => {
          state.propertiesLoading = false;
          state.properties =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchAvailableProperties.rejected,
        (state, action) => {
          state.propertiesLoading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // FETCH SINGLE ASSIGNMENT
    // =================================================
    builder
      .addCase(
        fetchStaffAssignmentById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStaffAssignmentById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedAssignment =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchStaffAssignmentById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // =================================================
    // CREATE ASSIGNMENT
    // =================================================
    builder
      .addCase(
        createStaffAssignment.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        createStaffAssignment.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Staff assigned successfully";

          if (action.payload?.data) {
            state.assignments.unshift(
              action.payload.data
            );
          }
        }
      )

      .addCase(
        createStaffAssignment.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
          state.success = false;
        }
      );

    // =================================================
    // UPDATE ASSIGNMENT
    // =================================================
    builder
      .addCase(
        updateStaffAssignment.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        updateStaffAssignment.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Staff assignment updated successfully";

          const updatedAssignment =
            action.payload?.data;

          if (updatedAssignment) {
            state.assignments =
              state.assignments.map((item) =>
                item.id === updatedAssignment.id
                  ? updatedAssignment
                  : item
              );

            state.selectedAssignment =
              updatedAssignment;
          }
        }
      )

      .addCase(
        updateStaffAssignment.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
          state.success = false;
        }
      );

    // =================================================
    // DELETE ASSIGNMENT
    // =================================================
    builder
      .addCase(
        deleteStaffAssignment.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteStaffAssignment.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Staff assignment deleted successfully";

          state.assignments =
            state.assignments.filter(
              (item) =>
                item.id !== action.payload.id
            );
        }
      )

      .addCase(
        deleteStaffAssignment.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearStaffAssignmentError,
  clearStaffAssignmentMessage,
  clearSelectedAssignment,
} = staffAssignmentSlice.actions;

export default staffAssignmentSlice.reducer;