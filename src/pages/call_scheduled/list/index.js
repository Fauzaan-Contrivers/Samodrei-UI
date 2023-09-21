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
  fetchCallLogsMeetingDate,
  onCallLogFilterChangeHandler,
} from "src/store/call_scheduled";

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
  const [callScheduledData, setCallScheduledData] = useState([]);
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
  }, [page, pageSize, store.call_scheduled.filter]);
  const fetchData = async () => {
    // try {
    //   const response = await fetch(
    //     `${BASE_URL}tele-prescribers/get_call_logs_meeting_date`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log("response in call", response);
    //   const data = await response.json();
    //   console.log("data in scheduled", data);
    //   if (response.status == 200) {
    //     setCallScheduledData(data);
    //     toast.success(data.message, {
    //       duration: 2000,
    //     });
    //     // router.replace("/phonebook");
    //   }
    // } catch (error) {
    //   console.log("CHECK", error);
    // }
    setIsLoading(true);
    console.log("I am called");
    dispatch(
      fetchCallLogsMeetingDate({
        page_num: page + 1,
        page_size: pageSize,
      })
    ).then(() => {
      setIsLoading(false);
    });
  };

  const handleTeleMarkterValue = (e) => {
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "teleMarketerValue",
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
        <Typography variant="caption">{row?.Id}</Typography>
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
                <Typography>{`${row.First_Name} ${row.Last_Name}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      field: "Phone",
      minWidth: 250,
      headerName: "Phone",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.Phone}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>{`${row.Phone}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      field: "NPI",
      minWidth: 180,
      headerName: "NPI",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.NPI}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>{`${row.NPI}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 190,
      field: "Meeting Date",
      headerName: "Meeting Date",
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {row?.MeetingDate
            ? moment(row.MeetingDate).local().format("YYYY-MM-DD HH:mm:ss")
            : " "}
        </Typography>
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
          {/* <TableHeader onClick={() => handleClickDownloadDataCSV()} /> */}
          <DataGrid
            autoHeight
            pagination
            rows={isLoading ? [] : store.call_scheduled.callLogMeetingDate}
            columns={columns}
            loading={isLoading}
            rowCount={store.call_scheduled.totalRecords}
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
