import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { apiCall } from "src/configs/utils";

// ** Fetch Jobs
export const fetchJobsData = createAsyncThunk(
  "jobs/fetchData",
  async (params) => {
    let response = await apiCall("POST", "jobs/fetch_jobs", {
      ...params,
      limit: params.page_size,
      page_num: params.page_num,
      status: params.status,
      product_advocate: params.product_advocate,
      start_date: params.start_date,
      end_date: params.end_date,
      meet_with: params.meet_with,
      prescriber: params.prescriber,
      lunch_meeting: params.lunch_meeting,
      radius: params.radius,
    });
    console.log(response.data);
    return {
      totalRecords: response.data.result.records.count,
      result: response.data.result.records.jobs,
      LunchesSum: response.data.result.lunch_sum,
    };
  }
);

// ** Set is Loading True
export const setJobsLoadingTrue = createAsyncThunk(
  "jobs/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const fetchJobData = createAsyncThunk("jobs/get_job", async (params) => {
  let response = await apiCall("POST", "jobs/get_job", {
    ...params,
    job_id: params.id,
  });
  return {
    result: response.data,
  };
});

export const cancelJob = createAsyncThunk("jobs/cancel_job", async (params) => {
  let response = await apiCall("POST", "jobs/cancel_job", params);
  return response;
});

export const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    data: [],
    jobData: [],
    isLoading: false,
    totalRecords: 0,
    LunchesSum: 0,
    filter: {
      statusValue: "",
      productAdvocateValue: "",
      prescriberValue: "",
      startDateRange: "",
      endDateRange: "",
      dates: [],
      difference_location_doctor__c: "",
      question_2__c: [],
      meet_with: [],
      jobs_with_lunches_only: false,
      revisits: false,
    },
  },
  reducers: {
    onJobFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
    onRevisitFilterChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
    onCancelJobHandler(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobsData.fulfilled, (state, action) => {
      state.data = action.payload.result;
      state.isLoading = false;
      state.totalRecords = action.payload.totalRecords;
      state.LunchesSum = action.payload.LunchesSum;
    });
    builder.addCase(fetchJobData.fulfilled, (state, action) => {
      state.jobData = action.payload.result;
      state.isLoading = false;
    });
    builder.addCase(setJobsLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const {
  onJobFilterChangeHandler,
  onCancelJobHandler,
  onRevisitFilterChangeHandler,
} = jobsSlice.actions;

export default jobsSlice.reducer;
