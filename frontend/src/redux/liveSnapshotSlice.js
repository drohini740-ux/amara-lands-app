import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import liveSnapshotService from "../services/admin/liveSnapshotService";

// ===============================
// GET ALL LIVE SNAPSHOTS
// ===============================
export const fetchLiveSnapshots = createAsyncThunk(
  "liveSnapshots/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await liveSnapshotService.getLiveSnapshots();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch live snapshots"
      );
    }
  }
);

// ===============================
// GET SINGLE LIVE SNAPSHOT
// ===============================
export const fetchLiveSnapshot = createAsyncThunk(
  "liveSnapshots/fetchOne",
  async (id, thunkAPI) => {
    try {
      return await liveSnapshotService.getLiveSnapshot(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch live snapshot"
      );
    }
  }
);

// ===============================
// CREATE LIVE SNAPSHOT
// ===============================
export const addLiveSnapshot = createAsyncThunk(
  "liveSnapshots/create",
  async (snapshotData, thunkAPI) => {
    try {
      return await liveSnapshotService.createLiveSnapshot(snapshotData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create live snapshot"
      );
    }
  }
);

// ===============================
// DELETE LIVE SNAPSHOT
// ===============================
export const removeLiveSnapshot = createAsyncThunk(
  "liveSnapshots/delete",
  async (id, thunkAPI) => {
    try {
      await liveSnapshotService.deleteLiveSnapshot(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete live snapshot"
      );
    }
  }
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  snapshots: [],
  snapshot: null,
  loading: false,
  error: null,
  success: false,
};

// ===============================
// SLICE
// ===============================
const liveSnapshotSlice = createSlice({
  name: "liveSnapshots",
  initialState,

  reducers: {
    clearLiveSnapshotState: (state) => {
      state.snapshot = null;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================
      // FETCH ALL
      // ===============================
      .addCase(fetchLiveSnapshots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLiveSnapshots.fulfilled, (state, action) => {
        state.loading = false;
        state.snapshots = action.payload.snapshots || [];
      })

      .addCase(fetchLiveSnapshots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================
      // FETCH SINGLE
      // ===============================
      .addCase(fetchLiveSnapshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLiveSnapshot.fulfilled, (state, action) => {
        state.loading = false;
        state.snapshot = action.payload.snapshot;
      })

      .addCase(fetchLiveSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================
      // CREATE
      // ===============================
      .addCase(addLiveSnapshot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addLiveSnapshot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload.snapshot) {
          state.snapshots.unshift(action.payload.snapshot);
        }
      })

      .addCase(addLiveSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ===============================
      // DELETE
      // ===============================
      .addCase(removeLiveSnapshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeLiveSnapshot.fulfilled, (state, action) => {
        state.loading = false;

        state.snapshots = state.snapshots.filter(
          (snapshot) => snapshot.id !== action.payload
        );
      })

      .addCase(removeLiveSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLiveSnapshotState } = liveSnapshotSlice.actions;

export default liveSnapshotSlice.reducer;