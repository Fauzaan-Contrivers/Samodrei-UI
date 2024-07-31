// ** React Imports
import { useState, useEffect, forwardRef } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Delete from "mdi-material-ui/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";
import TableHeader from "src/views/Flagged_number/TableHeader";

// ** Third Party Imports
import format from "date-fns/format";
import DatePicker from "react-datepicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Config
import authConfig from "src/configs/auth";

// ** Styled Components
import { styled } from "@mui/material/styles";

import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

import moment from "moment";
import {
  fetchCallLogsData,
  onCallLogFilterChangeHandler,
} from "src/store/call_logs";

/* eslint-disable */
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

/* eslint-enable */
const CallLogs = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  const StyledLink = styled("a")(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.primary.main,
  }));

  useEffect(() => {
    fetchData();
  }, [page, pageSize, store.call_logs.filter]);

  const fetchData = () => {
    setIsLoading(true);
    dispatch(
      fetchCallLogsData({
        page_num: page + 1,
        page_size: pageSize,
        tele_marketer: store.call_logs.filter.teleMarketerValue,
        start_date: isNaN(Date.parse(startDate)) ? "" : startDate,
        end_date: isNaN(Date.parse(endDate)) ? "" : endDate,
        call_disposition: store.call_logs.filter.disposition.join(","),
        receiver_position: store.call_logs.filter.receiverPosition.join(","),
        phoneNumber: store.call_logs.filter.phoneNumber,
      })
    ).then(() => {
      setIsLoading(false);
    });
  };

  const handleTeleMarkterValue = (e) => {
    dispatch(
      onCallLogFilterChangeHandler({
        filter: e.target.name,
        value: e.target.value,
      })
    );
  };

  const handleDispositionValue = (e) => {
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "disposition",
        value: e.target.value,
      })
    );
  };

  const handleReceiverPositionValue = (e) => {
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "receiverPosition",
        value: e.target.value,
      })
    );
  };

  const setDatesHandler = (val) => {
    dispatch(onCallLogFilterChangeHandler({ filter: "dates", value: val }));
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
      dispatch(onCallLogFilterChangeHandler({ filter: "dates", value: dates }));
    }
    dispatch(
      onCallLogFilterChangeHandler({ filter: "startDateRange", value: start })
    );
    dispatch(
      onCallLogFilterChangeHandler({ filter: "endDateRange", value: end })
    );
  };

  const callLogsListViewColumns = [
    {
      minWidth: 80,
      field: "call_logs_Id",
      headerName: "Id",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.call_logs_Id}</Typography>
      ),
    },
    {
      flex: 0.5,
      field: "Tele_Prescriber_Name",
      minWidth: 250,
      headerName: "Tele-Prescriber",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.Phone}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{ color: "red" }}
                >{`${row.First_Name} ${row.Last_Name}`}</Typography>
                <Typography noWrap variant="caption">
                  {`${row.Phone}`}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },

    {
      flex: 0.5,
      field: "Tele_Marketer_Name",
      minWidth: 250,
      headerName: "Tele-Marketer",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.email}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "red" }}>{`${row.name}`}</Typography>
                <Typography noWrap variant="caption">
                  {row.email}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      field: "Team Name",
      minWidth: 250,
      headerName: "team name",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.team_name}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{ color: "red" }}
                >{`${row.team_name}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },

    {
      flex: 0.5,
      field: "CallReceiverName",
      minWidth: 180,
      headerName: "Call Receiver",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.CallReceiverPosition}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{ color: "red" }}
                >{`${row.CallReceiverName}`}</Typography>
                <Typography noWrap variant="caption">
                  {row.CallReceiverPosition}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 190,
      field: "LoggedDate",
      headerName: "Feedback Submitted Date",
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {row?.LoggedDate
            ? moment(row.LoggedDate).local().format("YYYY-MM-DD HH:mm:ss")
            : " "}
        </Typography>
      ),
    },
    {
      minWidth: 160,
      field: "CallDisposition",
      headerName: "Call Disposition",
      renderCell: ({ row }) => (
        <Tooltip title={row?.CallDisposition}>
          <Typography variant="caption">{row?.CallDisposition}</Typography>
        </Tooltip>
      ),
    },
    {
      minWidth: 80,
      field: "CallTime",
      headerName: "Call Time",
      renderCell: ({ row }) => (
        <Typography variant="caption">
          {parseFloat(row?.CallTime / 60).toFixed(2)}
        </Typography>
      ),
    },
    {
      minWidth: 400,
      field: "CallFeedback",
      headerName: "Comment",
      renderCell: ({ row }) => (
        <Tooltip title={row?.CallFeedback}>
          <Typography
            variant="caption"
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              padding: "1px",
              margin: "1px",
              overflow: "auto",
            }}
          >
            {row?.CallFeedback}
          </Typography>
        </Tooltip>
      ),
    },
    {
      minWidth: 150,
      field: "isAvailable",
      headerName: "Release Prescriber",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Release">
            <Box>
              <IconButton
                color="secondary"
                size="small"
                component="a"
                sx={{ textDecoration: "none" }}
                onClick={() => handleClick(row.call_logs_Id)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const columns = [...callLogsListViewColumns];

  const handleClick = async (logId) => {
    await axios
      .post(`${BASE_URL}call-logs/update-call-logs`, {
        logId,
      })
      .then((res) => {
        if (res.data.status == 200) {
          toast.success(res.data.message, {
            duration: 2000,
          });
          fetchData();
        }
      });
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Filters" />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Tele-Marketer"
                    name="teleMarketerValue"
                    onChange={handleTeleMarkterValue}
                    value={store.call_logs.filter.teleMarketerValue}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    name="phoneNumber"
                    onChange={handleTeleMarkterValue}
                    value={store.call_logs.filter.phoneNumber}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePickerWrapper>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={store.call_logs.filter.endDateRange}
                    selected={store.call_logs.filter.startDateRange}
                    startDate={store.call_logs.filter.startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={store.call_logs.filter.dates}
                        setDates={setDatesHandler}
                        label="Feedback submitted at"
                        end={store.call_logs.filter.endDateRange}
                        start={store.call_logs.filter.startDateRange}
                      />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="dense">
                  <InputLabel id="disposition-label">Disposition</InputLabel>
                  <Select
                    labelId="disposition-label"
                    id="disposition"
                    value={store.call_logs.filter.disposition}
                    onChange={handleDispositionValue}
                    label="Disposition"
                    multiple
                  >
                    <MenuItem value="">Select Disposition</MenuItem>
                    <MenuItem value="Wrong Number/not-in-Service">
                      Wrong Number/not-in-Service
                    </MenuItem>
                    <MenuItem value="No Answer/phone Keeping Ringing for more 5 minutes">
                      No Answer/phone Keeping Ringing for more 5 minutes
                    </MenuItem>
                    <MenuItem value="Call Answered but goes Direct to Voicemail (recorded VM option)">
                      Call Answered but goes Direct to Voicemail (recorded VM
                      option)
                    </MenuItem>
                    <MenuItem value="Call Answered with Do Not call/not interested in SOAANZ request">
                      Call Answered with Do Not call/not interested in SOAANZ
                      request
                    </MenuItem>
                    <MenuItem value="Call Answered with a Call Back Request (Call Scheduling Option)">
                      Call Answered with a Call Back Request (Call Scheduling
                      Option)
                    </MenuItem>
                    <MenuItem value="Call Answered and Directed to a Prescriber's Voicemail (recorded VM option)">
                      Call Answered and Directed to a Prescriber's Voicemail
                      (recorded VM option)
                    </MenuItem>
                    <MenuItem value="Call Answered and Detailed the listener about SOAANZ">
                      Call Answered and Detailed the listener about SOAANZ
                    </MenuItem>
                    <MenuItem value="Call Answered and Samples Requested">
                      Call Answered and Samples Requested
                    </MenuItem>
                    <MenuItem value="Call Answered and Fax Information Requested">
                      Call Answered and Fax Information Requested
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="dense">
                  <InputLabel id="receiver-position-label">
                    Receiver Position
                  </InputLabel>
                  <Select
                    labelId="receiver-position-label"
                    id="receiver-position"
                    value={store.call_logs.filter.receiverPosition}
                    onChange={handleReceiverPositionValue}
                    label="Receiver Position"
                    multiple
                  >
                    <MenuItem value="">Select Receiver Position</MenuItem>
                    <MenuItem value="Front Desk">Front Desk</MenuItem>
                    <MenuItem value="Operator">Operator</MenuItem>
                    <MenuItem value="Nurse">Nurse</MenuItem>
                    <MenuItem value="Nurse Practitioner">
                      Nurse Practitioner
                    </MenuItem>
                    <MenuItem value="Medical Assistant">
                      Medical Assistant
                    </MenuItem>
                    <MenuItem value="Physician Assistant">
                      Physician Assistant
                    </MenuItem>
                    <MenuItem value="Physician">Physician</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            callLogs={true}
            dataCSV={store.call_logs.callLogData}
            onClick={() => handleClickDownloadDataCSV()}
          />
          <DataGrid
            autoHeight
            pagination
            rows={isLoading ? [] : store.call_logs.callLogData}
            columns={columns}
            loading={isLoading}
            rowCount={store.call_logs.totalRecords}
            getRowId={(row) => row?.Id}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(newPage) => {
              setPage(newPage);
            }}
            onSelectionModelChange={(rows) => setSelectedRow(rows)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            paginationMode="server"
          />
        </Card>
      </Grid>
    </Grid>
  );
};

CallLogs.acl = {
  action: "read",
  subject: "acl-page",
};

export default CallLogs;
