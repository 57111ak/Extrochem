import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMolecules = createAsyncThunk(
  'molecules/fetchMolecules',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch("http://localhost:8000/generate_molecules/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let molecules = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        lines.forEach((line) => {
          try {
            const molecule = JSON.parse(line);

            // Dispatch only if the molecule status is "success"
            if (molecule.status === "success") {
              console.log("Molecule added:", molecule);
              dispatch(addMolecule(molecule));
            }
          } catch (e) {
            console.error("Error parsing molecule:", e);
          }
        });
      }

      return molecules; // Return the final list of molecules
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch molecules");
    }
  }
);

const moleculesSlice = createSlice({
  name: 'molecules',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMolecule: (state, action) => {
      const molecule = action.payload;

      // Flatten descriptors for easier access in the table
      const flattenedMolecule = {
        ...molecule,
        NumAtoms: molecule.descriptors?.NumAtoms || 0,
        docking_score: molecule.docking_score || null,
        docked_pdb_path: molecule.docked_pdb_path || null,
      };

      // Check if the molecule already exists in the state
      const exists = state.data.some(
        (existingMolecule) => existingMolecule.molecule_number === molecule.molecule_number
      );

      if (!exists) {
        state.data.push(flattenedMolecule);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMolecules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMolecules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Overwrite with the final list
      })
      .addCase(fetchMolecules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMolecule } = moleculesSlice.actions;
export default moleculesSlice.reducer;