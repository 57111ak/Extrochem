import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMolecules = createAsyncThunk(
  'molecules/fetchMolecules',
  async (config, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/generate_molecules/',
        config 
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch molecules');
    }
  }
);

const moleculesSlice = createSlice({
  name: 'molecules',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMolecules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMolecules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMolecules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default moleculesSlice.reducer;