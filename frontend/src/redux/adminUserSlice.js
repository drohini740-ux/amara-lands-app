import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers } from "../services/adminService";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async () => {
    const data = await getAllUsers();
    return data.users;
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",

  initialState: {
    users: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default adminUserSlice.reducer;