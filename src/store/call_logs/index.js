import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, API_KEY } from "src/configs/config";

// ** Directly defining apiCall function
async function apiCall(type = "GET", appendUrl, data = {}) {
  let URL = BASE_URL + appendUrl;
  let reqHeaders = {};
  reqHeaders["API-KEY"] = API_KEY;

  const token = localStorage.getItem("accessToken");
  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (type === "POST" || type === "PUT") {
    reqHeaders["Content-Type"] = "application/json";
    data = JSON.stringify(data);
  }

  try {
    switch (type) {
      case "GET":
        return await axios.get(URL, { headers: reqHeaders });
      case "DELETE":
        return await axios.delete(URL, { headers: reqHeaders, data });
      case "POST":
        return await axios.post(URL, data, { headers: reqHeaders });
      case "PUT":
        return await axios.put(URL, data, { headers: reqHeaders });
      default:
        console.log("apiCallError: this type not handled here", type);
    }
  } catch (error) {
    console.log("apiCall -- Catch error", appendUrl, error);
  }
}

// ** Fetch Jobs
export const fetchCallLogsData = createAsyncThunk(
  "call-logs/fetch-call-logs",
  async (params) => {
    let response = await apiCall("POST", "call-logs/fetch-call-logs", {
      ...params,
      limit: params.page_size,
      page_num: params.page_num,
    });
    console.log(response);
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
      phoneNumber: "",
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
