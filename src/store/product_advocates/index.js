import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Passport } from "mdi-material-ui";

// ** Axios Imports
import { apiCall } from "src/configs/utils";

// ** Fetch product_advocates
export const fetchProductAdvocatesData = createAsyncThunk(
  "product_advocates/fetchData",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/fetch_product_advocates",
      {
        ...params,
        limit: params.page_size,
        page_num: params.page_num,
        status: params.active_status,
        name_email: params.name_email,
      }
    );

    console.log(response.data.result.records.productAdvocates);

    return {
      totalRecords: response.data.result.records.count,
      result: response.data.result.records.productAdvocates,
    };
  }
);

export const fetchProductAdvocateData = createAsyncThunk(
  "product_advocate/fetchData",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/fetch_product_advocate_details",
      {
        ...params,
        id: params.id,
      }
    );

    return {
      totalRecords: response.data.total_records,
      result: response.data,
    };
  }
);

export const fetchProductAdvocateAnalyticsData = createAsyncThunk(
  "product_advocate/get_prod_adv_analytics",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/get_prod_adv_analytics",
      {
        ...params,
        start_date: params.start_date,
        end_date: params.end_date,
      }
    );
    console.log(response.data);

    return {
      result: response.data.totalVisits,
      timeSpent: response.data.timespent,
      visits: response.data.visits,
      timeSpentPerDay: response.data.hourspent,
    };
  }
);

export const updateProductAdvocateStatus = createAsyncThunk(
  "product_advocates/update_product_advocate",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/update_product_advocate",
      params
    );
    return response;
  }
);

export const updateProductAdvocateDosage = createAsyncThunk(
  "product_advocate/update_product_advocate",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/update_product_advocate",
      params
    );
    return response.data.body;
  }
);

export const getProductAdvocateNames = createAsyncThunk(
  "product_advocate/get_all_product_adv_name",
  async (params) => {
    let response = await apiCall(
      "POST",
      "product_advocate/get_all_product_adv_name",
      {
        ...params,
        clientId: params.clientId,
      }
    );

    return {
      result: response.data,
    };
  }
);

// ** Set is Loading True
export const setProductAdvocatesLoadingTrue = createAsyncThunk(
  "product_advocates/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const setProductAdvocateLoadingTrue = createAsyncThunk(
  "product_advocate/isLoadingTrue",
  async (params) => {
    return true;
  }
);

export const productAdvocatesSlice = createSlice({
  name: "product_advocates",
  initialState: {
    data: [],
    jobsData: [],
    meetWith: [],
    isLoading: false,
    totalRecords: 0,
    timeSpent: 0,
    visits: 0,
    timeSpentPerDay: [],
    names: [],
    filter: {
      name: "",
      id: null,
      Active__c: "",
      ProductAdvocateValue: "",
      preview: "",
      sub_view: [null],
      dates: [],
      startDateRange: "",
      endDateRange: "",
    },
  },
  reducers: {
    onProductAdvocateStatusChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value;
    },
    setProductAdvocateIdAndName(state, action) {
      const { id, name } = action.payload;
      state.filter.id = id;
      state.filter.name = name;
    },
    onUpdateProductAdvocateStatusUpdateHandler(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductAdvocatesData.fulfilled, (state, action) => {
      const params = action.meta.arg;
      if (params.active_status === "true" || params.active_status === "false") {
        state.data = action.payload.result;
      } else {
        state.data = action.payload.result;
        // state.data = [...state.data, ...action.payload.result];
      }
      state.isLoading = false;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(
      setProductAdvocatesLoadingTrue.fulfilled,
      (state, action) => {
        state.isLoading = true;
      }
    );
    builder.addCase(fetchProductAdvocateData.fulfilled, (state, action) => {
      const params = action.meta.arg;
      state.jobsData = action.payload.result;
      state.isLoading = false;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(
      setProductAdvocateLoadingTrue.fulfilled,
      (state, action) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      fetchProductAdvocateAnalyticsData.fulfilled,
      (state, action) => {
        const params = action.meta.arg;
        state.meetWith = action.payload.result;
        state.timeSpent = action.payload.timeSpent;
        state.visits = action.payload.visits;
        state.timeSpentPerDay = action.payload.timeSpentPerDay;
        state.isLoading = false;
      }
    );
    builder.addCase(getProductAdvocateNames.fulfilled, (state, action) => {
      const params = action.meta.arg;
      state.names = action.payload.result;
      state.isLoading = false;
    });
  },
});

export const {
  onProductAdvocateStatusChangeHandler,
  onUpdateProductAdvocateStatusUpdateHandler,
  setProductAdvocateIdAndName,
} = productAdvocatesSlice.actions;

export default productAdvocatesSlice.reducer;
