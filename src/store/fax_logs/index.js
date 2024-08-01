import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { apiCall } from "src/configs/utils";

// ** Fetch Jobs
export const fetchFaxLogsData = createAsyncThunk(
  "call-logs/fetch-all-fax-logs",
  async (params) => {
    console.log("Sending post request");
    let response = await apiCall("POST", "call-logs/fetch-all-fax-logs", {
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
    // console.log("response in fax logs", response)
    return {
      result: response.data.result.records,
      totalRecords: response.data.result.totalRecords,
    };
  }
);

// ** Set is Loading True
export const setfaxLogsLoadingTrue = createAsyncThunk(
  "call-logs/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const faxLogsSlice = createSlice({
  name: "fax_logs",
  initialState: {
    faxLogData: [],
    isLoading: false,
    totalRecords: 0,
    filter: {
      platform: null,
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
    onFaxLogFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFaxLogsData.fulfilled, (state, action) => {
      state.faxLogData = action.payload.result;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(setfaxLogsLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { onFaxLogFilterChangeHandler } = faxLogsSlice.actions;

export default faxLogsSlice.reducer;
