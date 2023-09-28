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
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";
import { onFaxLogFilterChangeHandler } from "src/store/fax_logs";
import { ringCentralConfig } from "src/configs/config";
const RC = require("@ringcentral/sdk").SDK;
// ** Configs
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";

// ** Next Import
import Link from "next/link";

const PhoneBook = () => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [limitExceeds, setLimitExceeds] = useState(false);
  const [filterPage, setFilterPage] = useState("");
  const [namePrescriber, setNamePrescriber] = useState("");
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [pageNumber, setPageNumber] = useState(
    store.prescribers.filter.page || null
  );
  const { socket } = store.call_logs.filter;
  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));
  dispatch(
    onFaxLogFilterChangeHandler({ filter: "platform", value: platform })
  );

  const { RC_SERVER_URL, RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT } =
    ringCentralConfig;

  useEffect(
    () => fetchPrescribersOnUpdate(),
    [store.prescribers.filter.page, store.prescribers.filter.pageSize]
  );
  useEffect(() => fetchPrescribersOnName(), [pageNumber, namePrescriber]);
  useEffect(() => setupRingCentralScript(), []);
  useEffect(() => initializeSocket(), []);
  useEffect(() => configureSocketEvents(socket), [socket]);
  useEffect(() => {
    var rcsdk = new RC({
      server: RC_SERVER_URL,
      clientId: RC_CLIENT_ID,
      clientSecret: RC_CLIENT_SECRET,
    });

    var p = rcsdk.platform();

    p.login({
      jwt: RC_JWT,
    });

    p.on(p.events.loginSuccess, function (e) {
      console.log("User logged in successfully");
      setPlatform(p);
    });
  }, []);

  const fetchPrescribersOnUpdatePageNumber = () => {
    setIsLoading(true);
    // console.log("page numbr", pageNumber);
    const fetchPrescribersDataWithDebounce = debounce(() => {
      dispatch(
        fetchPrescribersforPhoneLogs({
          page_num: pageNumber + 1,
          page_size: store.prescribers.filter.pageSize,
        })
      ).then(() => {
        setPageNumber(store.prescribers.filter.page);
        setIsLoading(false);
      });
    }, 2000);

    fetchPrescribersDataWithDebounce();
    return fetchPrescribersDataWithDebounce.cancel;
  };

    const fetchPrescribersOnName = () => {
      setIsLoading(true);
      // console.log("page numbr", pageNumber);
      const fetchPrescribersDataWithDebounce = debounce(() => {
      //   dispatch(
      //     fetchPrescribersforPhoneLogs({
      //       Name: prescriberName,
      //       page_num: pageNumber + 1,
      //       page_size: store.prescribers.filter.pageSize,
      //     })
      //   ).then(() => {
      //     setPageNumber(store.prescribers.filter.page);
      //     setIsLoading(false);
      //   });
      if (namePrescriber) {
        console.log("HERE IN DISPATCH")
        const [First_Name, Last_Name] = namePrescriber.split(" ");
      
        dispatch(
          fetchPrescribersforPhoneLogs({
            page_num: pageNumber + 1,
            page_size: store.prescribers.filter.pageSize,
            Last_Name: Last_Name,
            First_Name: First_Name,
          })
        ).then(() => {
          setPageNumber(store.prescribers.filter.page);
          setIsLoading(false);
        });
      } else {
        // If no name is provided, exclude Last_Name from the action
        dispatch(
          fetchPrescribersforPhoneLogs({
            page_num: pageNumber + 1,
            page_size: store.prescribers.filter.pageSize,
          })
        ).then(() => {
          setPageNumber(store.prescribers.filter.page);
          setIsLoading(false);
        });
      }

      }, 2000);

      fetchPrescribersDataWithDebounce();
      return fetchPrescribersDataWithDebounce.cancel;
    };


  const fetchPrescribersOnUpdate = () => {
    setIsLoading(true);
    // console.log("store.prescribers.filter.page", store.prescribers.filter.page);
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

  // console.log(
  //   "store.prescribers.PhonebookPrescribersData",
  //   store.prescribers.PhonebookPrescribersData
  // );
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
      if (response.status == 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("CHECK", error);
    }
  };

  const onActionClick = async (prescriberId) => {
    const updateStatus = await updatePrescriberCallStatus(prescriberId, true);
    if (updateStatus) {
      socket.emit("disable_prescriber", prescriberId);
    }
  };
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

  const pageNumberChangeHandler = (newPageNumber) => {
          
    const totalRecords =
      store.prescribers.totalRecords / store.prescribers.filter.pageSize;
    

    if (newPageNumber <= totalRecords) {
      console.log("HERE");
      setPageNumber(newPageNumber);
      setLimitExceeds(false);
      dispatch(
        onPrescriberFilterChangeHandler({
          filter: "page",
          value: newPageNumber,
        })
      );
    } else {
            setLimitExceeds(true);

      // console.log("The page number exceeds the limit.");
    }
  };

  console.log('name ', namePrescriber);

  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <>
        <div style={{display:"flex"}}>

          <div style={{ marginBottom: "10px", width: "200px" }}>
            <TextField
              id="outlined-basic"
              label="Go to page number"
              variant="outlined"
              onChange={(e) => {
                const newPageNumbr = e.target.value;
                pageNumberChangeHandler(newPageNumbr);
              }}
            />
            {limitExceeds && (
              <Typography color="error">Page limit exceeds</Typography>
            )}
          </div>
                    <div style={{ marginBottom: "10px", width: "200px", marginLeft: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Search by Name"
              variant="outlined"
              onChange={(e) => {
                 setNamePrescriber(e.target.value);
              }}
            />
          </div>
        </div>
    
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
