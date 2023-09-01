import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { apiCall } from "src/configs/utils";

// ** Fetch prescribers
export const fetchPrescribersData = createAsyncThunk(
  "prescribers/fetchData/",
  async (params) => {
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

export const fetchPrescribersforPhoneLogs = createAsyncThunk(
  "tele-prescribers/fetch_prescribers_for_Logs",
  async (params) => {
    let response = await apiCall(
      "POST",
      "tele-prescribers/fetch_prescribers_for_Logs",
      {
        ...params,
        page_num: params.page_num,
        limit: params.page_size,
      }
    );
    return {
      result: response.data.result.records.prescribers,
      totalRecords: response.data.result.records.count,
    };
  }
);

export const fetchAllTelePrescribers = createAsyncThunk(
  "tele-prescribers/fetch-tele-prescribers",
  async (params) => {
    let response = await apiCall(
      "POST",
      "tele-prescribers/fetch-tele-prescribers",
      {
        ...params,
        page_num: params.page_num,
        limit: params.page_size,
      }
    );
    return {
      result: response.data.prescribers,
      totalRecords: response.data.count,
    };
  }
);

export const fetchTraingingPrescribersData = createAsyncThunk(
  "prescriber/fetch_training_prescribers/",
  async (params) => {
    let response = await apiCall(
      "POST",
      "prescriber/fetch_training_prescribers",
      {
        ...params,
      }
    );
    return {
      prescribers: response.data.prescribers,
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
    return {
      totalRecords: response.data.total_records,
      result: response.data,
    };
  }
);

export const fetchTelePrescriberData = createAsyncThunk(
  "tele-prescribers/fetch_tele_prescriber_details/",
  async (params) => {
    let response = await apiCall(
      "POST",
      "tele-prescribers/fetch_tele_prescriber_details",
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

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData/",
  async (params) => {
    let response = await apiCall("POST", "dashboard/fetch_dashboard_data", {
      ...params,
      clientId: params.clientId,
    });
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
    return true;
  }
);

export const updateFlaggedAddress = createAsyncThunk(
  "prescriber/update_prescriber_flag_address",
  async (params) => {
    let response = await apiCall(
      "POST",
      "prescriber/update_prescriber_flag_address",
      {
        ...params,
        prescriber_id: params.id,
        flagged: false,
      }
    );
    return true;
  }
);

export const deletePrescriber = createAsyncThunk(
  "prescriber/delete_prescriber",
  async (params) => {
    let response = await apiCall("POST", "prescriber/delete_prescriber", {
      ...params,
      prescriberId: params.id,
      IsDeleted: params.isDeleted,
    });
    return true;
  }
);

export const getPrescribersName = createAsyncThunk(
  "prescriber/get_all_prescribers_name",
  async (params) => {
    let response = await apiCall(
      "POST",
      "prescriber/get_all_prescribers_name",
      {
        ...params,
        clientId: params.clientId,
        name: params.name,
      }
    );

    return {
      result: response.data.result,
      states: response.data.states,
      cities: response.data.cities,
      speciality: response.data.speciality,
    };
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
    trainingPrescribersData: [],
    PhonebookPrescribersData: [],
    TelePrescriberData: [],
    totalRecords: 0,
    disabledPrescribers: {},
    states: [],
    cities: [],
    speciality: [],
    state: [],
    isLoading: false,
    names: [],
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
    addDisabledPrescriber(state, action) {
      const prescriberId = action.payload;
      state.disabledPrescribers[prescriberId] = true;
    },
    updateDisabledPrescriber(state, action) {
      const prescriberId = action.payload;
      state.disabledPrescribers[prescriberId] = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPrescribersData.fulfilled, (state, action) => {
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
    builder.addCase(fetchTelePrescriberData.fulfilled, (state, action) => {
      (state.TelePrescriberData = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords);
    });
    builder.addCase(fetchPrescribersforPhoneLogs.fulfilled, (state, action) => {
      (state.PhonebookPrescribersData = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords);
    });
    builder.addCase(fetchAllTelePrescribers.fulfilled, (state, action) => {
      (state.PhonebookPrescribersData = action.payload.result),
        (state.isLoading = false),
        (state.totalRecords = action.payload.totalRecords);
    });
    builder.addCase(setPrescriberLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPrescribersName.fulfilled, (state, action) => {
      state.isLoading = false;
      state.names = action.payload.result;
      state.state = action.payload.states;
      state.cities = action.payload.cities;
      state.speciality = action.payload.speciality;
    });

    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      (state.dashboardData = action.payload.result), (state.isLoading = false);
    });

    builder.addCase(
      fetchTraingingPrescribersData.fulfilled,
      (state, action) => {
        (state.trainingPrescribersData = action.payload.prescribers),
          (state.isLoading = false);
      }
    );

    builder.addCase(setDashboardLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const {
  onPrescriberFilterChangeHandler,
  addDisabledPrescriber,
  updateDisabledPrescriber,
} = prescribersSlice.actions;

export default prescribersSlice.reducer;
