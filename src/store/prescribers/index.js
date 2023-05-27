import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { apiCall } from "src/configs/utils";

// ** Fetch prescribers
export const fetchPrescribersData = createAsyncThunk(
  "prescribers/fetchData/",
  async (params) => {
    console.log(params.page_num);
    let response = await apiCall("POST", "prescriber/fetch_prescribers", {
      ...params,
      page_num: params.page_num,
      limit: params.page_size,
      name: params.name,
      state: params.state,
      is_soaanz_prescriber: params.is_soaanz_prescriber,
    });
    return {
      totalRecords: response.data.result.records.count,
      result: response.data.result.records.prescribers,
      states: response.data.result.states,
    };
  }
);

export const fetchPrescriberData = createAsyncThunk(
  "prescriber/fetchData/",
  async (params) => {
    let response = await apiCall(
      "POST",
      "prescriber/fetch_prescriber_details",
      {
        ...params,
        id: params.id,
      }
    );
    console.log("Prescriber Record==>", response.data);
    return {
      totalRecords: response.data.total_records,
      result: response.data,
    };
  }
);

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData/",
  async (params) => {
    let response = await apiCall("POST", "dashboard/fetch_dashboard_data", {
      ...params,
    });
    console.log("Dashboard Record==>", response.data);
    return {
      result: response.data,
    };
  }
);

export const updatePrescriberAddress = createAsyncThunk(
  "prescriber/update_prescriber",
  async (params) => {
    let response = await apiCall(
      "POST",
      "prescriber/update_prescriber",
      params
    );
    console.log("update_prescriber", response.data.result);
    return true;
  }
);

// ** Set is Loading True
export const setPrescribersLoadingTrue = createAsyncThunk(
  "prescribers/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const setPrescriberLoadingTrue = createAsyncThunk(
  "prescriber/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const setDashboardLoadingTrue = createAsyncThunk(
  "dashboard/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const prescribersSlice = createSlice({
  name: "prescribers",
  initialState: {
    data: [],
    jobsData: [],
    dashboardData: [],
    totalRecords: 0,
    states: [],
    isLoading: false,
    filter: {
      State: "",
      Name: "",
      is_soaanz_prescriber: "",
    },
  },
  reducers: {
    onPrescriberFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPrescribersData.fulfilled, (state, action) => {
      console.log("ACTION", action.payload);
      (state.data = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords),
        (state.states = action.payload.states);
    });
    builder.addCase(setPrescribersLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPrescriberData.fulfilled, (state, action) => {
      (state.jobsData = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords);
    });
    builder.addCase(setPrescriberLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      // console.log('ACTION', action.payload.result)
      (state.dashboardData = action.payload.result), (state.isLoading = false);
    });
    builder.addCase(setDashboardLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { onPrescriberFilterChangeHandler } = prescribersSlice.actions;

export default prescribersSlice.reducer;
