import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import moment from "moment";
import { debounce } from "lodash";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Store & Actions Imports
import {
  addDisabledPrescriber,
  fetchPrescribersforPhoneLogs,
  updateDisabledPrescriber,
  onPrescriberFilterChangeHandler,
} from "src/store/prescribers";

import { onCallLogFilterChangeHandler } from "src/store/call_logs";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Configs
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";

// ** Next Import
import Link from "next/link";

const PhoneBook = () => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { socket } = store.call_logs.filter;
  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  useEffect(
    () => fetchPrescribersOnUpdate(),
    [store.prescribers.filter.page, store.prescribers.filter.pageSize]
  );
  useEffect(() => setupRingCentralScript(), []);
  useEffect(() => initializeSocket(), []);
  useEffect(() => configureSocketEvents(socket), [socket]);

  const fetchPrescribersOnUpdate = () => {
    setIsLoading(true);
    const fetchPrescribersDataWithDebounce = debounce(() => {
      dispatch(
        fetchPrescribersforPhoneLogs({
          page_num: store.prescribers.filter.page + 1,
          page_size: store.prescribers.filter.pageSize,
        })
      ).then(() => {
        setPage(store.prescribers.filter.page);
        setIsLoading(false);
      });
    }, 2000);

    fetchPrescribersDataWithDebounce();
    return fetchPrescribersDataWithDebounce.cancel;
  };

  const setupRingCentralScript = () => {
    const rcs = document.createElement("script");
    rcs.src =
      "https://ringcentral.github.io/ringcentral-embeddable/adapter.js?newAdapterUI=1";
    rcs.onload = () => {
      RCAdapter.setClosed(true);
      console.log("Script has been loaded successfully!");
    };
    document.body.appendChild(rcs);

    return () => rcs.remove();
  };

  const initializeSocket = () => {
    const newSocket = io.connect(BASE_URL, { transports: ["websocket"] });
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "socket",
        value: newSocket,
      })
    );
  };

  const configureSocketEvents = (socket) => {
    if (socket) {
      socket.on("disable_prescriber", (prescriberId) => {
        dispatch(addDisabledPrescriber(prescriberId));
        updatePrescriberCallStatus(prescriberId, true);
      });
      socket.on("enable_prescriber", (prescriberId) => {
        dispatch(updateDisabledPrescriber(prescriberId));
      });
    }
  };

  const updatePrescriberCallStatus = async (prescriberId, flag) => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update_tele_prescriber_call_status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prescriberId, flagged: flag }),
        }
      );
      console.log("DATA", await response.json());
    } catch (error) {
      console.error("CHECK", error);
    }
  };

  const onActionClick = (prescriberId) =>
    socket.emit("disable_prescriber", prescriberId);
  const isActionDisabled = (prescriberId) =>
    store.prescribers.disabledPrescribers[prescriberId];

  const defineColumns = () => {
    const defaultColumns = [
      {
        field: "Id",
        minWidth: 210,
        headerName: "Id",
        renderCell: ({ row }) => (
          <Typography variant="body2">{`${row?.Id}`}</Typography>
        ),
      },
      {
        field: "NPI",
        minWidth: 210,
        headerName: "NPI",
        renderCell: ({ row }) => (
          <Typography variant="body2">{`${row?.NPI}`}</Typography>
        ),
      },
      {
        field: "Name",
        minWidth: 210,
        headerName: "Name",
        renderCell: ({ row }) => (
          <Typography variant="body2">{`${row?.First_Name} ${row?.Last_Name}`}</Typography>
        ),
      },
      {
        field: "Phone",
        minWidth: 210,
        headerName: "Phone",
        renderCell: ({ row }) => (
          <Typography variant="body2">{`${row?.Phone}`}</Typography>
        ),
      },
      {
        field: "Fax",
        minWidth: 120,
        headerName: "FAX",
        renderCell: ({ row }) => (
          <Typography variant="body2">{`${row?.Fax}`}</Typography>
        ),
      },
      {
        field: "MeetingDate",
        minWidth: 210,
        headerName: "Meeting Date",
        renderCell: ({ row }) => (
          <Typography variant="body2">
            {row?.MeetingDate
              ? moment(row.MeetingDate).local().format("YYYY-MM-DD HH:mm:ss")
              : ""}
          </Typography>
        ),
      },
      {
        flex: 0.1,
        minWidth: 100,
        field: "Action",
        headerName: "Action",
        renderCell: ({ row }) => (
          <Grid container alignItems="center">
            <Link href={`/phonebook/preview/${row.Id}`} passHref>
              <IconButton
                size="small"
                component="a"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => onActionClick(row.Id)}
                disabled={
                  isActionDisabled(row.Id) || row.isOnCall ? true : false
                }
              >
                <EyeOutline
                  fontSize="small"
                  sx={{
                    color:
                      isActionDisabled(row.Id) || row.isOnCall ? "red" : null,
                  }}
                />
              </IconButton>
            </Link>
          </Grid>
        ),
      },
    ];
    return [...defaultColumns];
  };

  const columns = defineColumns();

  const pageSizeChangeHandler = (newPageSize) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "pageSize",
        value: newPageSize,
      })
    );
  };

  const pageChangeHandler = (newPage) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "page",
        value: newPage,
      })
    );
  };

  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <>
          <Grid item xs={12}>
            <Card>
              <DataGrid
                autoHeight
                pagination
                rows={
                  isLoading ? [] : store.prescribers.PhonebookPrescribersData
                }
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row?.Id}
                rowCount={store.prescribers.totalRecords}
                disableSelectionOnClick
                page={page}
                pageSize={store.prescribers.filter.pageSize}
                rowsPerPageOptions={[20, 30, 50]}
                onPageChange={(newPage) => pageChangeHandler(newPage)}
                onPageSizeChange={(newPageSize) =>
                  pageSizeChangeHandler(newPageSize)
                }
                paginationMode="server"
              />
            </Card>
          </Grid>
        </>
      ) : null}
    </div>
  );
};

PhoneBook.acl = {
  action: "read",
  subject: "acl-page",
};

export default PhoneBook;
