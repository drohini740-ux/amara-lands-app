 

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/staff";

// ===============================
// GET ALL STAFF
// ===============================
export const fetchSuperAdminStaff = createAsyncThunk(
  "superAdminStaff/fetchStaff",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(API_URL);
      return data.staff || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch staff."
      );
    }
  }
);

// ===============================
// GET STAFF BY ID
// ===============================
export const fetchSuperAdminStaffById = createAsyncThunk(
  "superAdminStaff/fetchStaffById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`${API_URL}/${id}`);
      return data.staff;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch staff member."
      );
    }
  }
);

// ===============================
// UPDATE STAFF STATUS
// ===============================
export const updateSuperAdminStaffStatus = createAsyncThunk(
  "superAdminStaff/updateStaffStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`${API_URL}/${id}/status`, {
        status,
      });
      return data.staff;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update staff status."
      );
    }
  }
);

// ===============================
// UPDATE STAFF ROLE
// ===============================
export const updateSuperAdminStaffRole = createAsyncThunk(
  "superAdminStaff/updateStaffRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`${API_URL}/${id}/role`, {
        role,
      });
      return data.staff;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update staff role."
      );
    }
  }
);

// ===============================
// GET STAFF ASSIGNMENTS
// ===============================
export const fetchSuperAdminStaffAssignments = createAsyncThunk(
  "superAdminStaff/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`${API_URL}/assignments/all`);
      return data.assignments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch staff assignments."
      );
    }
  }
);

// ===============================
// UPDATE ASSIGNMENT STATUS
// ===============================
export const updateSuperAdminAssignmentStatus = createAsyncThunk(
  "superAdminStaff/updateAssignmentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`${API_URL}/assignments/${id}/status`, {
        status,
      });
      return data.assignment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update assignment status."
      );
    }
  }
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  staff: [],
  selectedStaff: null,
  assignments: [],
  loading: false,
  updateLoading: false,
  assignmentsLoading: false,
  error: null,
  assignmentsError: null,
};

// ===============================
// SLICE
// ===============================
const superAdminStaffSlice = createSlice({
  name: "superAdminStaff",
  initialState,
  reducers: {
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    },
    clearStaffError: (state) => {
      state.error = null;
      state.assignmentsError = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH STAFF
    builder
      .addCase(fetchSuperAdminStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(fetchSuperAdminStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH STAFF BY ID
    builder
      .addCase(fetchSuperAdminStaffById.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminStaffById.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchSuperAdminStaffById.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // UPDATE STAFF STATUS
    builder
      .addCase(updateSuperAdminStaffStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSuperAdminStaffStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedStaff = action.payload;
        if (!updatedStaff) return;

        const index = state.staff.findIndex(
          (item) => item.id === updatedStaff.id
        );
        if (index !== -1) {
          state.staff[index] = { ...state.staff[index], ...updatedStaff };
        }

        if (state.selectedStaff?.id === updatedStaff.id) {
          state.selectedStaff = { ...state.selectedStaff, ...updatedStaff };
        }
      })
      .addCase(updateSuperAdminStaffStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // UPDATE STAFF ROLE
    builder
      .addCase(updateSuperAdminStaffRole.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSuperAdminStaffRole.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedStaff = action.payload;
        if (!updatedStaff) return;

        const index = state.staff.findIndex(
          (item) => item.id === updatedStaff.id
        );
        if (index !== -1) {
          state.staff[index] = { ...state.staff[index], ...updatedStaff };
        }

        if (state.selectedStaff?.id === updatedStaff.id) {
          state.selectedStaff = { ...state.selectedStaff, ...updatedStaff };
        }
      })
      .addCase(updateSuperAdminStaffRole.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // FETCH ASSIGNMENTS
    builder
      .addCase(fetchSuperAdminStaffAssignments.pending, (state) => {
        state.assignmentsLoading = true;
        state.assignmentsError = null;
      })
      .addCase(fetchSuperAdminStaffAssignments.fulfilled, (state, action) => {
        state.assignmentsLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchSuperAdminStaffAssignments.rejected, (state, action) => {
        state.assignmentsLoading = false;
        state.assignmentsError = action.payload;
      });

    // UPDATE ASSIGNMENT STATUS
    builder
      .addCase(updateSuperAdminAssignmentStatus.pending, (state) => {
        state.updateLoading = true;
        state.assignmentsError = null;
      })
      .addCase(updateSuperAdminAssignmentStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedAssignment = action.payload;
        if (!updatedAssignment) return;

        const index = state.assignments.findIndex(
          (item) => item.id === updatedAssignment.id
        );
        if (index !== -1) {
          state.assignments[index] = {
            ...state.assignments[index],
            ...updatedAssignment,
          };
        }
      })
      .addCase(updateSuperAdminAssignmentStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.assignmentsError = action.payload;
      });
  },
});

export const { clearSelectedStaff, clearStaffError } =
  superAdminStaffSlice.actions;

export default superAdminStaffSlice.reducer;

