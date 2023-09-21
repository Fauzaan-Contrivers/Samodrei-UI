// ** React Imports
import { useState, useEffect, forwardRef } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
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
var FormData = require("form-data");

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
  fetchFaxLogsData,
  onCallLogFilterChangeHandler,
} from "src/store/fax_logs";
import { ringCentralConfig } from "src/configs/config";
const RC = require("@ringcentral/sdk").SDK;
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
const FaxLogs = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imgBlob, setBlob] = useState(null);
  // const [platform, setPlatform] = useState(null);
  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { platform } = useSelector((state) => state.fax_logs.filter);
  // console.log("platform", platform);
  //  const { RC_SERVER_URL, RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT } =
  //    ringCentralConfig;

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));
  const storedAccessToken = window.localStorage.getItem("accessToken");
  const StyledLink = styled("a")(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.primary.main,
  }));
  useEffect(() => {
    fetchData();
  }, [page, pageSize, store.call_logs.filter]);

  //  useEffect(() => {
  //    var rcsdk = new RC({
  //      server: RC_SERVER_URL,
  //      clientId: RC_CLIENT_ID,
  //      clientSecret: RC_CLIENT_SECRET,
  //    });

  //    var p = rcsdk.platform();

  //    p.login({
  //      jwt: RC_JWT,
  //    });

  //    p.on(p.events.loginSuccess, function (e) {
  //      console.log("User logged in successfully");
  //      console.log('p,p',p)
  //      setPlatform(p);
  //    });
  //  }, []);
  const fetchData = () => {
    setIsLoading(true);
    dispatch(fetchFaxLogsData()).then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // fetch("http://localhost:3000/files/fax.jpg")
    fetch("https://dashboard.samodrei.com/files/faxImage.jpg")
      .then((response) => response.blob())
      .then((blob) => {
        setBlob(blob);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  }, []);
  let originalId;
  const handleSend = async (row) => {
    const originalFaxId = row.faxId;
    originalId = row.Id;
    // console.log("originalFaxId", row.Id);
    try {
      var formData = null;

      formData = new FormData();

      var bodyParams = {
        // originalMessageId: row.faxId,
        to: [{ phoneNumber: row.faxNumber }],
        coverPageText: "",
      };

      const jsonBlob = new Blob([JSON.stringify(bodyParams)], {
        type: "application/json",
      });

      formData.append("json", jsonBlob, "request.json");

      const file = new File([imgBlob], "fax.jpg", { type: "image/jpeg" });

      formData.append("attachment", file);
      // POST /restapi/v1.0/account/11112222/extension/22223333/fax HTTP/1.1
      const endpoint = `/restapi/v1.0/account/~/extension/~/fax`;

      var resp = await platform
        .post(endpoint, formData)
        .then(async function (resp) {
          var jsonObj = await resp.json();
          // console.log("DATA: ", jsonObj);
          // console.log("FAX sent. Message id: " + jsonObj.id);

          update_fax_number_data(originalFaxId, jsonObj.messageStatus);

          toast.success("Success", {
            duration: 5000,
          });
          check_fax_message_status(jsonObj.id);
        });
    } catch (e) {
      toast.error("Error sending fax", {
        duration: 5000,
      });
      console.log(e.message);
    }
  };

  async function update_fax_number_data(id, messageStatus) {
    // console.log("originalId in update", originalId);
    try {
      const response = await fetch(
        `${BASE_URL}call-logs/update-fax-logs-resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Id: originalId,
            faxId: id,
            status: messageStatus,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        console.log("Table Updated", data);
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  }
  async function check_fax_message_status(messageId) {
    try {
      let endpoint = `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`;
      let resp = await platform.get(endpoint);
      let jsonObj = await resp.json();
      // console.log("Message status: ", jsonObj.messageStatus);
      // console.log("Message jsonObj: ", jsonObj);

      if (jsonObj.messageStatus == "Queued") {
        await sleep(10000);
        // update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        check_fax_message_status(jsonObj.id);
      } else if (jsonObj.messageStatus == "Sent") {
        // console.log(" jsonObj.messageStatus", jsonObj.messageStatus);
        update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        toast.success(jsonObj.messageStatus, {
          duration: 5000,
        });
      } else {
        // console.log("else objjson", jsonObj);
        update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        toast.error(jsonObj.messageStatus, {
          duration: 5000,
        });
      }
    } catch (e) {
      // update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
      toast.error("Error", {
        duration: 5000,
      });
      console.log(e);
    }
  }

  const sleep = async (ms) => {
    await new Promise((r) => setTimeout(r, ms));
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
      field: "fax_logs_Id",
      headerName: "Id",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.Id}</Typography>
      ),
    },
    {
      minWidth: 200,
      field: "Tele-Marketer Id",
      headerName: "Tele-Marketer Id",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.TeleMarketerId}</Typography>
      ),
    },
    {
      flex: 0.5,
      field: "faxNumber",
      minWidth: 250,
      headerName: "fax Number",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.faxNumber}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                //   sx={{ color: "red" }}
                >{`${row.faxNumber} `}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      field: "faxId",
      minWidth: 250,
      headerName: "Fax Id",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.faxId}`}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                //   sx={{ color: "red" }}
                >{`${row.faxId}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      field: "Status",
      minWidth: 250,
      headerName: "Status",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`${row.status}`}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItmes: "center",
                }}
              >
                <Typography
                //   sx={{ color: "red" }}
                >{`${row.status}`}</Typography>
                {row.status === "SendingFailed" && (
                  <Button
                    variant="outlined"
                    sx={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      height: "30px",
                      marginLeft: "10px",
                    }}
                    onClick={() => handleSend(row)}
                  >
                    Resend
                  </Button>
                )}
              </Box>
            </Tooltip>
          </Box>
        );
      },
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
            rows={isLoading ? [] : store.fax_logs.faxLogData}
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

FaxLogs.acl = {
  action: "read",
  subject: "acl-page",
};

export default FaxLogs;
