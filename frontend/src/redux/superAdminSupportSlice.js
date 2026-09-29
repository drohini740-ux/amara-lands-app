import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/support";

// ===============================
// FETCH ALL SUPPORT TICKETS
// ===============================
export const fetchSuperAdminSupportTickets = createAsyncThunk(
  "superAdminSupport/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch support tickets."
        );
      }

      return data.tickets || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===============================
// FETCH TICKET BY ID
// ===============================
export const fetchSuperAdminSupportTicketById =
  createAsyncThunk(
    "superAdminSupport/fetchTicketById",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message || "Failed to fetch support ticket."
          );
        }

        return data.ticket;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// ===============================
// UPDATE TICKET STATUS
// ===============================
export const updateSuperAdminSupportTicketStatus =
  createAsyncThunk(
    "superAdminSupport/updateTicketStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/tickets/${id}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message || "Failed to update ticket status."
          );
        }

        return data.ticket;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// ===============================
// UPDATE TICKET PRIORITY
// ===============================
export const updateSuperAdminSupportTicketPriority =
  createAsyncThunk(
    "superAdminSupport/updateTicketPriority",
    async ({ id, priority }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/tickets/${id}/priority`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              priority,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message || "Failed to update ticket priority."
          );
        }

        return data.ticket;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// ===============================
// FETCH WHATSAPP SUPPORT
// ===============================
export const fetchSuperAdminWhatsAppSupport =
  createAsyncThunk(
    "superAdminSupport/fetchWhatsApp",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/whatsapp`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to fetch WhatsApp support."
          );
        }

        return data.support || [];
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// ===============================
// UPDATE WHATSAPP SUPPORT
// ===============================
export const updateSuperAdminWhatsAppSupport =
  createAsyncThunk(
    "superAdminSupport/updateWhatsApp",
    async ({ id, supportData }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/whatsapp/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(supportData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update WhatsApp support."
          );
        }

        return data.support;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  tickets: [],
  selectedTicket: null,

  whatsappSupport: [],

  loading: false,
  updateLoading: false,
  whatsappLoading: false,

  error: null,
  whatsappError: null,
};

// ===============================
// SLICE
// ===============================
const superAdminSupportSlice = createSlice({
  name: "superAdminSupport",
  initialState,

  reducers: {
    clearSelectedSupportTicket: (state) => {
      state.selectedTicket = null;
    },

    clearSupportError: (state) => {
      state.error = null;
      state.whatsappError = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // FETCH TICKETS
    // =========================
    builder
      .addCase(
        fetchSuperAdminSupportTickets.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminSupportTickets.fulfilled,
        (state, action) => {
          state.loading = false;
          state.tickets = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminSupportTickets.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // =========================
    // FETCH TICKET BY ID
    // =========================
    builder
      .addCase(
        fetchSuperAdminSupportTicketById.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminSupportTicketById.fulfilled,
        (state, action) => {
          state.updateLoading = false;
          state.selectedTicket = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminSupportTicketById.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // =========================
    // UPDATE STATUS
    // =========================
    builder
      .addCase(
        updateSuperAdminSupportTicketStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminSupportTicketStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedTicket = action.payload;

          const index = state.tickets.findIndex(
            (ticket) =>
              ticket.id === updatedTicket.id
          );

          if (index !== -1) {
            state.tickets[index] = {
              ...state.tickets[index],
              ...updatedTicket,
            };
          }

          if (
            state.selectedTicket &&
            state.selectedTicket.id === updatedTicket.id
          ) {
            state.selectedTicket = {
              ...state.selectedTicket,
              ...updatedTicket,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminSupportTicketStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // =========================
    // UPDATE PRIORITY
    // =========================
    builder
      .addCase(
        updateSuperAdminSupportTicketPriority.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminSupportTicketPriority.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedTicket = action.payload;

          const index = state.tickets.findIndex(
            (ticket) =>
              ticket.id === updatedTicket.id
          );

          if (index !== -1) {
            state.tickets[index] = {
              ...state.tickets[index],
              ...updatedTicket,
            };
          }

          if (
            state.selectedTicket &&
            state.selectedTicket.id === updatedTicket.id
          ) {
            state.selectedTicket = {
              ...state.selectedTicket,
              ...updatedTicket,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminSupportTicketPriority.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // =========================
    // FETCH WHATSAPP
    // =========================
    builder
      .addCase(
        fetchSuperAdminWhatsAppSupport.pending,
        (state) => {
          state.whatsappLoading = true;
          state.whatsappError = null;
        }
      )

      .addCase(
        fetchSuperAdminWhatsAppSupport.fulfilled,
        (state, action) => {
          state.whatsappLoading = false;
          state.whatsappSupport = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminWhatsAppSupport.rejected,
        (state, action) => {
          state.whatsappLoading = false;
          state.whatsappError = action.payload;
        }
      );

    // =========================
    // UPDATE WHATSAPP
    // =========================
    builder
      .addCase(
        updateSuperAdminWhatsAppSupport.pending,
        (state) => {
          state.whatsappLoading = true;
          state.whatsappError = null;
        }
      )

      .addCase(
        updateSuperAdminWhatsAppSupport.fulfilled,
        (state, action) => {
          state.whatsappLoading = false;

          const updatedSupport = action.payload;

          const index =
            state.whatsappSupport.findIndex(
              (item) =>
                item.id === updatedSupport.id
            );

          if (index !== -1) {
            state.whatsappSupport[index] = {
              ...state.whatsappSupport[index],
              ...updatedSupport,
            };
          } else {
            state.whatsappSupport.push(
              updatedSupport
            );
          }
        }
      )

      .addCase(
        updateSuperAdminWhatsAppSupport.rejected,
        (state, action) => {
          state.whatsappLoading = false;
          state.whatsappError = action.payload;
        }
      );
  },
});

export const {
  clearSelectedSupportTicket,
  clearSupportError,
} = superAdminSupportSlice.actions;

export default superAdminSupportSlice.reducer;