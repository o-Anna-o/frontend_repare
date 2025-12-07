import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { ContentType } from "../../api/Api";

export const formRequestThunk = createAsyncThunk(
  "requestShip/form",
  async (
    data: {
      id: number;
      containers20: number;
      containers40: number;
      comment: string;
    },
    thunkAPI
  ) => {
    try {
      await api.api.requestShipFormationUpdate(
        data.id,
        {
          secure: true,
          type: ContentType.Json,
          body: {
            containers_20ft: data.containers20,
            containers_40ft: data.containers40,
            comment: data.comment,
          },
        } as any // ← важно
      );

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
