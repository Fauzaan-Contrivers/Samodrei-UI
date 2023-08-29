// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

// ** Icons
import Send from "mdi-material-ui/Send";
import Check from "mdi-material-ui/Check";
import Close from "mdi-material-ui/Close";
import ChartPie from "mdi-material-ui/ChartPie";
import Download from "mdi-material-ui/Download";
import ArrowDown from "mdi-material-ui/ArrowDown";
import EyeOutline from "mdi-material-ui/EyeOutline";
import TrendingUp from "mdi-material-ui/TrendingUp";
import ContentCopy from "mdi-material-ui/ContentCopy";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import InformationOutline from "mdi-material-ui/InformationOutline";
import ContentSaveOutline from "mdi-material-ui/ContentSaveOutline";

// ** Third Party Imports
import format from "date-fns/format";
import DatePicker from "react-datepicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchData, deleteInvoice } from "src/store/apps/invoice";
import { fetchJobsData } from "src/store/jobs";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

import { useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import TableHeader from "src/views/jobs/TableHeader";
// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Config
import authConfig from "src/configs/auth";

// ** Styled Components
import { styled } from "@mui/material/styles";
import { convertDateToReadableFormat } from "src/configs/utils";

import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

import Autocomplete from "@mui/material/Autocomplete";

import moment from "moment";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { FastForward } from "mdi-material-ui";
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
    setIsLoading(true);
    dispatch(
      fetchCallLogsData({
        page_num: page + 1,
        page_size: pageSize,
        tele_marketer: store.call_logs.filter.teleMarketerValue,
        start_date: isNaN(Date.parse(startDate)) ? "" : startDate,
        end_date: isNaN(Date.parse(endDate)) ? "" : endDate,
      })
    ).then(() => {
      setIsLoading(false);
    });
  }, [page, pageSize, store.call_logs.filter]);

  const handleTeleMarkterValue = (e) => {
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "teleMarketerValue",
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
      minWidth: 160,
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
        <Typography variant="caption">{row?.CallDisposition}</Typography>
      ),
    },
    {
      minWidth: 160,
      field: "CallTime",
      headerName: "Call Time",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.CallTime}</Typography>
      ),
    },
    {
      minWidth: 160,
      field: "CallFeedback",
      headerName: "Comment",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.CallFeedback}</Typography>
      ),
    },
  ];

  const columns = [...callLogsListViewColumns];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Filters" />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Tele-Marketer"
                    onChange={handleTeleMarkterValue}
                    value={store.call_logs.filter.teleMarketerValue}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          {/* <TableHeader onClick={() => handleClickDownloadDataCSV()} /> */}
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
