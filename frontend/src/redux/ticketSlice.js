import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getTickets,
  getTicket,
  addTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

// Get All
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    return await getTickets();
  }
);

// Get Single
export const fetchTicket = createAsyncThunk(
  "tickets/fetchTicket",
  async (id) => {
    return await getTicket(id);
  }
);

// Add
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticketData) => {
    return await addTicket(ticketData);
  }
);

// Update
export const editTicket = createAsyncThunk(
  "tickets/editTicket",
  async ({ id, ticketData }) => {
    return await updateTicket(id, ticketData);
  }
);

// Delete
export const removeTicket = createAsyncThunk(
  "tickets/removeTicket",
  async (id) => {
    await deleteTicket(id);
    return id;
  }
);

const ticketSlice = createSlice({
  name: "tickets",

  initialState: {
    tickets: [],
    ticket: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
  builder

    // Fetch All
    .addCase(fetchTickets.pending, (state) => {
      state.loading = true;
    })

    .addCase(fetchTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload.tickets || [];
    })

    .addCase(fetchTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    // Fetch Single
    .addCase(fetchTicket.fulfilled, (state, action) => {
      state.ticket = action.payload.ticket;
    })

    // Create
    .addCase(createTicket.fulfilled, (state, action) => {
      if (action.payload.ticket) {
        state.tickets.unshift(action.payload.ticket);
      }
    })

    // Update
    .addCase(editTicket.fulfilled, (state, action) => {
      state.tickets = state.tickets.map((ticket) =>
        ticket.id === action.payload.ticket.id
          ? action.payload.ticket
          : ticket
      );

      state.ticket = action.payload.ticket;
    })

    // Delete
    .addCase(removeTicket.fulfilled, (state, action) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    });

  },
});

export default ticketSlice.reducer;