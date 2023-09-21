import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { apiCall } from "src/configs/utils";

// ** Fetch Jobs
export const fetchCallLogsMeetingDate = createAsyncThunk(
  "tele-prescribers/get_call_logs_meeting_date",
  async (params) => {
    let response = await apiCall(
      "POST",
      "tele-prescribers/get_call_logs_meeting_date",
      {
        ...params,
        limit: params.page_size,
        page_num: params.page_num,
      }
    );
    console.log("response in store ", response.data.result.totalRecords);
    return {
      result: response.data.result.records,
      totalRecords: response.data.result.totalRecords,
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

export const callLogsMeetingSlice = createSlice({
  name: "call_logs_meeting",
  initialState: {
    callLogMeetingDate: [],
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
    builder.addCase(fetchCallLogsMeetingDate.fulfilled, (state, action) => {
      state.callLogMeetingDate = action.payload.result;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(setCallLogsLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { onCallLogFilterChangeHandler } = callLogsMeetingSlice.actions;

export default callLogsMeetingSlice.reducer;
