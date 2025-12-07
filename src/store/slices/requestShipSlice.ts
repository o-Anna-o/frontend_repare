import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

export const formRequestThunk = createAsyncThunk(
  "requestShip/form",
  async (id: number, thunkAPI) => {
    try {
      // <- здесь добавили secure: true чтобы securityWorker добавил Authorization
      await api.api.requestShipFormationUpdate(id, { secure: true });
      return true;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e?.message || "Ошибка формирования");
    }
  }
);
interface RequestShipState {
  loading: boolean;
}

const initialState: RequestShipState = {
  loading: false,
};

const requestShipSlice = createSlice({
  name: "requestShip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(formRequestThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(formRequestThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(formRequestThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default requestShipSlice.reducer;
