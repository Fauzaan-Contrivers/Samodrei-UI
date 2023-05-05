import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Passport } from 'mdi-material-ui'

// ** Axios Imports
import { apiCall } from 'src/configs/utils'

// ** Fetch product_advocates
export const fetchProductAdvocatesData = createAsyncThunk('product_advocates/fetchData', async params => {
  let response = await apiCall('POST', 'product_advocate/fetch_product_advocates', {
    ...params,
    limit: params.page_size,
    page_num: params.page_num,
    status: params.active_status,
    name_email: params.name_email
  })

  console.log(response.data.result.records.productAdvocates)

  return {
    totalRecords: response.data.result.records.count,
    result: response.data.result.records.productAdvocates
  }
})

export const fetchProductAdvocateData = createAsyncThunk('product_advocate/fetchData', async params => {
  let response = await apiCall('POST', 'product_advocate/fetch_product_advocate_details', {
    ...params,
    id: params.id
  })

  return {
    totalRecords: response.data.total_records,
    result: response.data
  }
})

export const updateProductAdvocateStatus = createAsyncThunk(
  'product_advocates/update_product_advocate',
  async params => {
    let response = await apiCall('POST', 'product_advocate/update_product_advocate', params)
    return response
  }
)

export const updateProductAdvocateDosage = createAsyncThunk(
  'product_advocate/update_product_advocate',
  async params => {
    let response = await apiCall('POST', 'update_product_advocate', params)
    return response.data.body
  }
)

// ** Set is Loading True
export const setProductAdvocatesLoadingTrue = createAsyncThunk('product_advocates/isLoadingTrue', async params => {
  return true
})

export const setProductAdvocateLoadingTrue = createAsyncThunk('product_advocate/isLoadingTrue', async params => {
  return true
})

export const productAdvocatesSlice = createSlice({
  name: 'product_advocates',
  initialState: {
    data: [],
    jobsData: [],
    isLoading: false,
    totalRecords: 0,
    filter: {
      Active__c: '',
      ProductAdvocateValue: '',
      preview: '',
      sub_view: [null]
    }
  },
  reducers: {
    onProductAdvocateStatusChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value
    },
    onUpdateProductAdvocateStatusUpdateHandler(state, action) {
      state.data = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchProductAdvocatesData.fulfilled, (state, action) => {
      const params = action.meta.arg
      if (params.active_status === 'true' || params.active_status === 'false') {
        state.data = action.payload.result
      } else {
        state.data = action.payload.result
        // state.data = [...state.data, ...action.payload.result];
      }
      state.isLoading = false
      state.totalRecords = action.payload.totalRecords
    })
    builder.addCase(setProductAdvocatesLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchProductAdvocateData.fulfilled, (state, action) => {
      const params = action.meta.arg
      state.jobsData = action.payload.result
      state.isLoading = false
      state.totalRecords = action.payload.totalRecords
    })
    builder.addCase(setProductAdvocateLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true
    })
  }
})

export const { onProductAdvocateStatusChangeHandler, onUpdateProductAdvocateStatusUpdateHandler } =
  productAdvocatesSlice.actions

export default productAdvocatesSlice.reducer
