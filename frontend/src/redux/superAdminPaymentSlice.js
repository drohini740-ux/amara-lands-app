import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/payments";

// ==========================================
// GET ALL PAYMENTS
// ==========================================
export const fetchSuperAdminPayments = createAsyncThunk(
  "superAdminPayment/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.payments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payments."
      );
    }
  }
);

// ==========================================
// GET PAYMENT BY ID
// ==========================================
export const fetchSuperAdminPaymentById = createAsyncThunk(
  "superAdminPayment/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.payment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payment."
      );
    }
  }
);

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
export const updateSuperAdminPaymentStatus = createAsyncThunk(
  "superAdminPayment/updateStatus",
  async ({ id, payment_status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/status`,
        {
          payment_status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.payment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update payment status."
      );
    }
  }
);

// ==========================================
// UPDATE REFUND STATUS
// ==========================================
export const updateSuperAdminRefundStatus = createAsyncThunk(
  "superAdminPayment/updateRefundStatus",
  async ({ id, refund_status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/refund-status`,
        {
          refund_status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.payment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update refund status."
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  payments: [],
  selectedPayment: null,

  loading: false,
  updateLoading: false,

  error: null,
};

// ==========================================
// SLICE
// ==========================================
const superAdminPaymentSlice = createSlice({
  name: "superAdminPayment",
  initialState,

  reducers: {
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },

    clearPaymentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // GET ALL PAYMENTS
    // ======================================
    builder
      .addCase(
        fetchSuperAdminPayments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminPayments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.payments = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminPayments.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // GET PAYMENT BY ID
    // ======================================
    builder
      .addCase(
        fetchSuperAdminPaymentById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminPaymentById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedPayment = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminPaymentById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // UPDATE PAYMENT STATUS
    // ======================================
    builder
      .addCase(
        updateSuperAdminPaymentStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminPaymentStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedPayment = action.payload;

          const index = state.payments.findIndex(
            (payment) =>
              payment.id === updatedPayment.id
          );

          if (index !== -1) {
            state.payments[index] = {
              ...state.payments[index],
              ...updatedPayment,
            };
          }

          if (
            state.selectedPayment?.id ===
            updatedPayment.id
          ) {
            state.selectedPayment = {
              ...state.selectedPayment,
              ...updatedPayment,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminPaymentStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // UPDATE REFUND STATUS
    // ======================================
    builder
      .addCase(
        updateSuperAdminRefundStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminRefundStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedPayment = action.payload;

          const index = state.payments.findIndex(
            (payment) =>
              payment.id === updatedPayment.id
          );

          if (index !== -1) {
            state.payments[index] = {
              ...state.payments[index],
              ...updatedPayment,
            };
          }

          if (
            state.selectedPayment?.id ===
            updatedPayment.id
          ) {
            state.selectedPayment = {
              ...state.selectedPayment,
              ...updatedPayment,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminRefundStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearSelectedPayment,
  clearPaymentError,
} = superAdminPaymentSlice.actions;

export default superAdminPaymentSlice.reducer;