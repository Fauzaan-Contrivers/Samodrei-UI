import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { apiCall } from "src/configs/utils";

// ** Fetch Jobs
export const fetchCallLogsData = createAsyncThunk(
  "call-logs/fetch-call-logs",
  async (params) => {
    let response = await apiCall("POST", "call-logs/fetch-call-logs", {
      ...params,
      limit: params.page_size,
      page_num: params.page_num,
      // status: params.status,
      // product_advocate: params.product_advocate,
      // start_date: params.start_date,
      // end_date: params.end_date,
      // meet_with: params.meet_with,
      // prescriber: params.prescriber,
      // lunch_meeting: params.lunch_meeting,
      // radius: params.radius,
    });
    return {
      result: response.data.result.data,
      totalRecords: response.data.result.count,
    };
  }
);

// ** Set is Loading True
export const setCallLogsLoadingTrue = createAsyncThunk(
  "call-logs/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const callLogsSlice = createSlice({
  name: "call_logs",
  initialState: {
    callLogData: [],
    isLoading: false,
    totalRecords: 0,
    filter: {
      teleMarketerValue: "",
      socket: null,
      telePrescriberValue: "",
      disposition: [],
      receiverPosition: [],
      startDateRange: "",
      endDateRange: "",
      dates: [],
    },
  },
  reducers: {
    onCallLogFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCallLogsData.fulfilled, (state, action) => {
      state.callLogData = action.payload.result;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(setCallLogsLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { onCallLogFilterChangeHandler } = callLogsSlice.actions;

export default callLogsSlice.reducer;
