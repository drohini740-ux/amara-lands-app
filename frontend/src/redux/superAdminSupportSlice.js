import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/support";

// ===============================
// FETCH ALL SUPPORT TICKETS
// ===============================
export const fetchSuperAdminSupportTickets = createAsyncThunk(
  "superAdminSupport/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/tickets`);
      return response.data.tickets || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch support tickets."
      );
    }
  }
);

// ===============================
// FETCH TICKET BY ID
// ===============================
export const fetchSuperAdminSupportTicketById = createAsyncThunk(
  "superAdminSupport/fetchTicketById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/tickets/${id}`);
      return response.data.ticket;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch support ticket."
      );
    }
  }
);

// ===============================
// UPDATE TICKET STATUS
// ===============================
export const updateSuperAdminSupportTicketStatus = createAsyncThunk(
  "superAdminSupport/updateTicketStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/tickets/${id}/status`,
        { status }
      );
      return response.data.ticket;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update ticket status."
      );
    }
  }
);

// ===============================
// UPDATE TICKET PRIORITY
// ===============================
export const updateSuperAdminSupportTicketPriority = createAsyncThunk(
  "superAdminSupport/updateTicketPriority",
  async ({ id, priority }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/tickets/${id}/priority`,
        { priority }
      );
      return response.data.ticket;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update ticket priority."
      );
    }
  }
);

// ===============================
// FETCH WHATSAPP SUPPORT
// ===============================
export const fetchSuperAdminWhatsAppSupport = createAsyncThunk(
  "superAdminSupport/fetchWhatsApp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/whatsapp`);
      return response.data.support || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch WhatsApp support."
      );
    }
  }
);

// ===============================
// UPDATE WHATSAPP SUPPORT
// ===============================
export const updateSuperAdminWhatsAppSupport = createAsyncThunk(
  "superAdminSupport/updateWhatsApp",
  async ({ id, supportData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/whatsapp/${id}`,
        supportData
      );
      return response.data.support;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update WhatsApp support."
      );
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
    // FETCH TICKETS
    builder
      .addCase(fetchSuperAdminSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSuperAdminSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // FETCH TICKET BY ID
    builder
      .addCase(fetchSuperAdminSupportTicketById.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminSupportTicketById.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchSuperAdminSupportTicketById.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || action.error.message;
      });

    // UPDATE TICKET STATUS
    builder
      .addCase(updateSuperAdminSupportTicketStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSuperAdminSupportTicketStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedTicket = action.payload;

        if (!updatedTicket) return;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id
        );

        if (index !== -1) {
          state.tickets[index] = {
            ...state.tickets[index],
            ...updatedTicket,
          };
        }

        if (state.selectedTicket?.id === updatedTicket.id) {
          state.selectedTicket = {
            ...state.selectedTicket,
            ...updatedTicket,
          };
        }
      })
      .addCase(updateSuperAdminSupportTicketStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || action.error.message;
      });

    // UPDATE TICKET PRIORITY
    builder
      .addCase(updateSuperAdminSupportTicketPriority.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSuperAdminSupportTicketPriority.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedTicket = action.payload;

        if (!updatedTicket) return;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id
        );

        if (index !== -1) {
          state.tickets[index] = {
            ...state.tickets[index],
            ...updatedTicket,
          };
        }

        if (state.selectedTicket?.id === updatedTicket.id) {
          state.selectedTicket = {
            ...state.selectedTicket,
            ...updatedTicket,
          };
        }
      })
      .addCase(
        updateSuperAdminSupportTicketPriority.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload || action.error.message;
        }
      );

    // FETCH WHATSAPP SUPPORT
    builder
      .addCase(fetchSuperAdminWhatsAppSupport.pending, (state) => {
        state.whatsappLoading = true;
        state.whatsappError = null;
      })
      .addCase(fetchSuperAdminWhatsAppSupport.fulfilled, (state, action) => {
        state.whatsappLoading = false;
        state.whatsappSupport = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSuperAdminWhatsAppSupport.rejected, (state, action) => {
        state.whatsappLoading = false;
        state.whatsappError = action.payload || action.error.message;
      });

    // UPDATE WHATSAPP SUPPORT
    builder
      .addCase(updateSuperAdminWhatsAppSupport.pending, (state) => {
        state.whatsappLoading = true;
        state.whatsappError = null;
      })
      .addCase(updateSuperAdminWhatsAppSupport.fulfilled, (state, action) => {
        state.whatsappLoading = false;
        const updatedSupport = action.payload;

        if (!updatedSupport) return;

        const index = state.whatsappSupport.findIndex(
          (item) => item.id === updatedSupport.id
        );

        if (index !== -1) {
          state.whatsappSupport[index] = {
            ...state.whatsappSupport[index],
            ...updatedSupport,
          };
        } else {
          state.whatsappSupport.push(updatedSupport);
        }
      })
      .addCase(updateSuperAdminWhatsAppSupport.rejected, (state, action) => {
        state.whatsappLoading = false;
        state.whatsappError = action.payload || action.error.message;
      });
  },
});

export const {
  clearSelectedSupportTicket,
  clearSupportError,
} = superAdminSupportSlice.actions;

export default superAdminSupportSlice.reducer;