import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/faqs";

// GET ALL FAQS
export const fetchFaqs = createAsyncThunk(
  "superAdminFaq/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      return response.data.faqs || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch FAQs."
      );
    }
  }
);

// CREATE FAQ
export const createFaq = createAsyncThunk(
  "superAdminFaq/createFaq",
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await API.post(API_URL, faqData);
      return response.data.faq;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create FAQ."
      );
    }
  }
);

// UPDATE FAQ
export const updateFaq = createAsyncThunk(
  "superAdminFaq/updateFaq",
  async ({ id, faqData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}`, faqData);
      return response.data.faq;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update FAQ."
      );
    }
  }
);

// UPDATE FAQ STATUS
export const updateFaqStatus = createAsyncThunk(
  "superAdminFaq/updateFaqStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}/status`, {
        status,
      });
      return response.data.faq;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update FAQ status."
      );
    }
  }
);

// DELETE FAQ
export const deleteFaq = createAsyncThunk(
  "superAdminFaq/deleteFaq",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete FAQ."
      );
    }
  }
);

// INITIAL STATE
const initialState = {
  faqs: [],
  loading: false,
  error: null,
};

// SLICE
const superAdminFaqSlice = createSlice({
  name: "superAdminFaq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(createFaq.fulfilled, (state, action) => {
        if (action.payload) {
          state.faqs.unshift(action.payload);
        }
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(updateFaq.fulfilled, (state, action) => {
        const updatedFaq = action.payload;
        if (!updatedFaq) return;

        const index = state.faqs.findIndex(
          (faq) => faq.id === updatedFaq.id
        );

        if (index !== -1) {
          state.faqs[index] = {
            ...state.faqs[index],
            ...updatedFaq,
          };
        }
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // STATUS
      .addCase(updateFaqStatus.fulfilled, (state, action) => {
        const updatedFaq = action.payload;
        if (!updatedFaq) return;

        const index = state.faqs.findIndex(
          (faq) => faq.id === updatedFaq.id
        );

        if (index !== -1) {
          state.faqs[index] = {
            ...state.faqs[index],
            ...updatedFaq,
          };
        }
      })
      .addCase(updateFaqStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(
          (faq) => faq.id !== action.payload
        );
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default superAdminFaqSlice.reducer;