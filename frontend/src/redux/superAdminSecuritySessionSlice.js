import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/security-sessions";

// =====================================================
// GET ALL SESSIONS
// =====================================================

export const fetchSecuritySessions = createAsyncThunk(
  "superAdminSecuritySession/fetchSecuritySessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch security sessions."
      );
    }
  }
);

// =====================================================
// GET SESSION BY ID
// =====================================================

export const fetchSecuritySessionById = createAsyncThunk(
  "superAdminSecuritySession/fetchSecuritySessionById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch session."
      );
    }
  }
);

// =====================================================
// UPDATE SESSION STATUS
// =====================================================

export const updateSecuritySessionStatus = createAsyncThunk(
  "superAdminSecuritySession/updateSecuritySessionStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update session status."
      );
    }
  }
);

// =====================================================
// FORCE LOGOUT SESSION
// =====================================================

export const forceLogoutSecuritySession = createAsyncThunk(
  "superAdminSecuritySession/forceLogoutSecuritySession",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/force-logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to force logout session."
      );
    }
  }
);

// =====================================================
// DELETE SESSION
// =====================================================

export const deleteSecuritySession = createAsyncThunk(
  "superAdminSecuritySession/deleteSecuritySession",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete session."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  sessions: [],
  selectedSession: null,

  loading: false,
  actionLoading: false,

  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminSecuritySessionSlice = createSlice({
  name: "superAdminSecuritySession",
  initialState,

  reducers: {
    clearSelectedSecuritySession: (state) => {
      state.selectedSession = null;
    },

    clearSecuritySessionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH ALL
      // =================================================

      .addCase(
        fetchSecuritySessions.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSecuritySessions.fulfilled,
        (state, action) => {
          state.loading = false;

          state.sessions =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchSecuritySessions.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch security sessions.";
        }
      )

      // =================================================
      // FETCH BY ID
      // =================================================

      .addCase(
        fetchSecuritySessionById.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSecuritySessionById.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.selectedSession =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchSecuritySessionById.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to fetch session.";
        }
      )

      // =================================================
      // UPDATE STATUS
      // =================================================

      .addCase(
        updateSecuritySessionStatus.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSecuritySessionStatus.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedSession =
            action.payload?.data;

          if (updatedSession) {
            const index =
              state.sessions.findIndex(
                (session) =>
                  session.id ===
                  updatedSession.id
              );

            if (index !== -1) {
              state.sessions[index] = {
                ...state.sessions[index],
                ...updatedSession,
              };
            }

            state.selectedSession =
              updatedSession;
          }
        }
      )

      .addCase(
        updateSecuritySessionStatus.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to update session status.";
        }
      )

      // =================================================
      // FORCE LOGOUT
      // =================================================

      .addCase(
        forceLogoutSecuritySession.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        forceLogoutSecuritySession.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedSession =
            action.payload?.data;

          if (updatedSession) {
            const index =
              state.sessions.findIndex(
                (session) =>
                  session.id ===
                  updatedSession.id
              );

            if (index !== -1) {
              state.sessions[index] = {
                ...state.sessions[index],
                ...updatedSession,
              };
            }

            state.selectedSession =
              updatedSession;
          }
        }
      )

      .addCase(
        forceLogoutSecuritySession.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to force logout session.";
        }
      )

      // =================================================
      // DELETE
      // =================================================

      .addCase(
        deleteSecuritySession.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteSecuritySession.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const deletedSession =
            action.payload?.data;

          if (deletedSession) {
            state.sessions =
              state.sessions.filter(
                (session) =>
                  session.id !==
                  deletedSession.id
              );
          }

          state.selectedSession = null;
        }
      )

      .addCase(
        deleteSecuritySession.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to delete session.";
        }
      );
  },
});

export const {
  clearSelectedSecuritySession,
  clearSecuritySessionError,
} =
  superAdminSecuritySessionSlice.actions;

export default superAdminSecuritySessionSlice.reducer;