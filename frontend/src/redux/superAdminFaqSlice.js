import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:4000/api/v1/super-admin/faqs";

// GET ALL FAQS
export const fetchFaqs = createAsyncThunk(
  "superAdminFaq/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch FAQs."
        );
      }

      return data.faqs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// CREATE FAQ
export const createFaq = createAsyncThunk(
  "superAdminFaq/createFaq",
  async (faqData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to create FAQ."
        );
      }

      return data.faq;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE FAQ
export const updateFaq = createAsyncThunk(
  "superAdminFaq/updateFaq",
  async ({ id, faqData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update FAQ."
        );
      }

      return data.faq;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE FAQ STATUS
export const updateFaqStatus = createAsyncThunk(
  "superAdminFaq/updateFaqStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update FAQ status."
        );
      }

      return data.faq;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// DELETE FAQ
export const deleteFaq = createAsyncThunk(
  "superAdminFaq/deleteFaq",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to delete FAQ."
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  faqs: [],
  loading: false,
  error: null,
};

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
        state.faqs = action.payload;
      })

      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createFaq.fulfilled, (state, action) => {
        state.faqs.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateFaq.fulfilled, (state, action) => {
        const index = state.faqs.findIndex(
          (faq) => faq.id === action.payload.id
        );

        if (index !== -1) {
          state.faqs[index] = action.payload;
        }
      })

      // STATUS
      .addCase(updateFaqStatus.fulfilled, (state, action) => {
        const index = state.faqs.findIndex(
          (faq) => faq.id === action.payload.id
        );

        if (index !== -1) {
          state.faqs[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(
          (faq) => faq.id !== action.payload
        );
      });
  },
});

export default superAdminFaqSlice.reducer;