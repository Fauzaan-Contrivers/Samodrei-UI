import { useEffect, useState, forwardRef } from "react";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductAdvocateAnalyticsData,
  getProductAdvocateNames,
} from "src/store/product_advocates";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import format from "date-fns/format";
import DatePicker from "react-datepicker";
import {
  onProductAdvocateStatusChangeHandler,
  setProductAdvocateIdAndName,
} from "src/store/product_advocates";
import moment from "moment";
import RechartsLineChart from "src/views/charts/recharts/RechartsLineChart";
import RechartsWrapper from "src/@core/styles/libs/recharts";
import RechartsPieChart from "src/views/charts/recharts/RechartsPieChart";
import TimeSpentBarChart from "src/views/charts/chartjs/ProductAdvocateTimeSpentBarChart";
import { Paper, Typography } from "@mui/material";
// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "@mui/material/styles";

const CustomInput = forwardRef((props, ref) => {
  const startDate = Boolean(props.start)
    ? format(props.start, "MM/dd/yyyy")
    : "";
  const endDate = Boolean(props.end)
    ? ` - ${format(props.end, "MM/dd/yyyy")}`
    : null;
  const value = `${startDate}${endDate !== null ? endDate : ""}`;
  props.start === null && props.dates.length && props.setDates
    ? props.setDates([])
    : null;
  const updatedProps = { ...props };
  delete updatedProps.setDates;

  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ""}
      value={value}
    />
  );
});

const Analytics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ** Hook
  const theme = useTheme();

  const barChartYellow = "#ffcf5c";
  const labelColor = theme.palette.text.primary;
  const borderColor = theme.palette.action.focus;
  const gridLineColor = theme.palette.action.focus;

  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  useEffect(() => {
    dispatch(getProductAdvocateNames({ clientId: 1 }));
  }, []);

  useEffect(() => {
    const startDate = moment(
      store.product_advocates.filter.startDateRange,
      "YYYY-MM-DD"
    );
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const endDate = moment(
      store.product_advocates.filter.endDateRange,
      "YYYY-MM-DD"
    );
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    dispatch(
      fetchProductAdvocateAnalyticsData({
        id: store.product_advocates.filter.id,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      })
    );
  }, [store.product_advocates.filter]);

  const setDatesHandler = (val) => {
    dispatch(
      onProductAdvocateStatusChangeHandler({ filter: "dates", value: val })
    );
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;

    const startDate = moment(start, "YYYY-MM-DD");
    const formattedStartDate = startDate.format("YYYY-MM-DD");

    const endDate = moment(end, "YYYY-MM-DD");
    const formattedEndStartDate = endDate.format("YYYY-MM-DD");
    if (formattedStartDate && formattedEndStartDate) {
      setStartDate(formattedStartDate);
      setEndDate(formattedEndStartDate);
    }
    if (start !== null && end !== null) {
      dispatch(
        onProductAdvocateStatusChangeHandler({ filter: "dates", value: dates })
      );
    }

    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "startDateRange",
        value: start,
      })
    );

    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "endDateRange",
        value: end,
      })
    );
  };

  const handleSearchState = (event) => {
    const searchText = event.target.value;
    dispatch(
      setProductAdvocateIdAndName({
        name: searchText,
      })
    );
  };

  const handleOptionChange = (e, value, field) => {
    dispatch(
      setProductAdvocateIdAndName({
        id: value ? value.id : "",
        name: value ? value.value : "",
      })
    );
  };

  let fd_Count = 0;
  let md_Count = 0;
  let np_Count = 0;
  let ph_Count = 0;
  let pa_Count = 0;
  let om_Count = 0;
  let nurse_Count = 0;

  store?.product_advocates?.meetWith?.map((item) => {
    if (item.question_2 == null || item.question_2 == "Front Desk Staff") {
      fd_Count += parseInt(item.count);
    }
    if (item.question_2 == "Physician") {
      ph_Count = parseInt(item.count);
    }
    if (item.question_2 == "Nurse Practitioner (NP)") {
      np_Count = parseInt(item.count);
    }
    if (
      item.question_2 == "Physician’s Assistant (PA)" ||
      item.question_2 == " Physician?s Assistant (PA)"
    ) {
      pa_Count = parseInt(item.count);
    }
    if (item.question_2 == "Office Manager") {
      om_Count = parseInt(item.count);
    }
    if (item.question_2 == "Medical Assistant (MA)") {
      md_Count = parseInt(item.count);
    }
    if (item.question_2 == "Nurse") {
      nurse_Count = parseInt(item.count);
    }
  });

  let hours = store.product_advocates.timeSpent;
  let visit = store.product_advocates.visits;

  console.log(store.product_advocates.filter);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Filters" />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Paper style={{ padding: "10px" }}>
                    <FormControl fullWidth>
                      <Autocomplete
                        value={{
                          id: store.product_advocates.filter.id,
                          // label: productAdvocate.name,
                          value: store.product_advocates.filter.name,
                        }}
                        onChange={(e, value) =>
                          handleOptionChange(e, value, "name")
                        }
                        options={store.product_advocates.names.map((item) => ({
                          id: item.Id,
                          value: item.Name,
                          // label: item.Name,
                        }))}
                        getOptionLabel={(option) => option.value}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            onChange={handleSearchState}
                            label="Select Product Advocate"
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper style={{ padding: "10px" }}>
                    <DatePickerWrapper>
                      <DatePicker
                        isClearable
                        selectsRange
                        monthsShown={2}
                        endDate={store.product_advocates.filter.endDateRange}
                        selected={store.product_advocates.filter.startDateRange}
                        startDate={
                          store.product_advocates.filter.startDateRange
                        }
                        shouldCloseOnSelect={false}
                        id="date-range-picker-months"
                        onChange={handleOnChangeRange}
                        customInput={
                          <CustomInput
                            dates={store.product_advocates.filter.dates}
                            setDates={setDatesHandler}
                            label="Select Date Range"
                            end={store.product_advocates.filter.endDateRange}
                            start={
                              store.product_advocates.filter.startDateRange
                            }
                          />
                        }
                      />
                    </DatePickerWrapper>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid mt={1}>
        {store.product_advocates.meetWith.length > 0 ? (
          <div>
            <RechartsWrapper>
              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs={12} md={6}>
                  <TimeSpentBarChart
                    data={store.product_advocates.timeSpentPerDay}
                    yellow={barChartYellow}
                    labelColor={labelColor}
                    borderColor={borderColor}
                    gridLineColor={gridLineColor}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RechartsPieChart
                    fd={fd_Count}
                    ma={md_Count}
                    nurse={nurse_Count}
                    np={np_Count}
                    ph={ph_Count}
                    om={om_Count}
                    pa={pa_Count}
                  />
                </Grid>
              </Grid>
            </RechartsWrapper>
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "4px",
                marginTop: "4px",
                padding: "16px",
              }}
            >
              <div style={{ flex: 0.58 }}>
                <Typography variant="h6">
                  {`Total Time Spent: ${Number(hours / 60).toFixed(2)} Hours `}
                </Typography>
              </div>
              <div>
                <Typography variant="h6">
                  {`Total Visits: ${visit} `}
                </Typography>
              </div>
            </Card>
          </div>
        ) : null}
      </Grid>
    </>
  );
};

export default Analytics;
