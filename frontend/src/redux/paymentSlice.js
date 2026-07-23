import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentService from "../services/paymentService";

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async () => {
    const res = await paymentService.getPayments();
    return res.data.payments;
  }
);

export const removePayment = createAsyncThunk(
  "payments/removePayment",
  async (id) => {
    await paymentService.deletePayment(id);
    return id;
  }
);

export const createOrder = createAsyncThunk(
  "payments/createOrder",
  async (data) => {
    const response = await paymentService.createOrder(data);
    return response.data;
  }
);

export const verifyPayment = createAsyncThunk(
  "payments/verifyPayment",
  async (data) => {
    const response = await paymentService.verifyPayment(data);
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: "payments",

  initialState: {
    payments: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })

      .addCase(fetchPayments.rejected, (state) => {
        state.loading = false;
      })

      .addCase(removePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(
          (payment) => payment.id !== action.payload
        );
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })

      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(verifyPayment.rejected, (state) => {
        state.loading = false;
      });

  },
});

export default paymentSlice.reducer;