import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { apiCall } from "src/configs/utils";

// ** Fetch Jobs
export const fetchSamplesData = createAsyncThunk(
  "samples/fetchData",
  async (params) => {
    let response = await apiCall("POST", "sample/fetch_samples", {
      ...params,
      page_num: params.page_num,
      limit: params.page_size,
      product_advocate: params.product_advocate,
      prescriber: params.prescriber,
      sample_status: params.sample_status,
    });

    return {
      totalRecords: response.data.result.records.count,
      result: response.data.result.records.samples,
      delivered_mg_20: response.data.result.delivered_mg_20,
      delivered_mg_60: response.data.result.delivered_mg_60,
      product_advocate: response.data.ProductAdvocates,
    };
  }
);

// ** Set is Loading True
export const setSamplesLoadingTrue = createAsyncThunk(
  "jobs/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const cancelSampleData = createAsyncThunk(
  "samples/cancelSample",
  async (params) => {
    const response = await apiCall("POST", "sample/cancel_sample", params);
    return response.data.body.status;
  }
);

export const samplesSlice = createSlice({
  name: "samples",
  initialState: {
    data: [],
    isLoading: false,
    delivered_mg_20: 0,
    delivered_mg_60: 0,
    totalRecords: 0,
    product_advocate: [],
    filter: {
      productAdvocateValue: "",
      prescriberValue: "",
      Status__c: "",
    },
  },
  reducers: {
    onSampleFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
    onSampleCancelHandler(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSamplesData.fulfilled, (state, action) => {
      (state.data = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords),
        (state.delivered_mg_20 = action.payload.delivered_mg_20),
        (state.delivered_mg_60 = action.payload.delivered_mg_60),
        (state.product_advocate = action.payload.product_advocate);
    });
    builder.addCase(setSamplesLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { onSampleFilterChangeHandler, onSampleCancelHandler } =
  samplesSlice.actions;

export default samplesSlice.reducer;
