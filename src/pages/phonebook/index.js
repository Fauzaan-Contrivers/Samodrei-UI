import { useState, useEffect, useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import {
  addDisabledPrescriber,
  fetchPrescribersforPhoneLogs,
  updateDisabledPrescriber,
  onPrescriberFilterChangeHandler,
} from "src/store/prescribers";
import { debounce } from "lodash";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import io from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";
import moment from "moment";

// ** Next Import
import Link from "next/link";

const PhoneBook = () => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const ability = useContext(AbilityContext);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  useEffect(() => {
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
  }, [store.prescribers.filter.page, store.prescribers.filter.pageSize]);
  useEffect(() => {
    const rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/ringcentral-embeddable/adapter.js";

    const scriptLoaded = () => {
      RCAdapter.setClosed(true);
      console.log("Script has been loaded successfully!");
    };

    rcs.onload = scriptLoaded;

    const rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);

    // Clean up the script when the component unmounts
    return () => {
      rcs.parentNode.removeChild(rcs);
    };
  }, []);

  useEffect(() => {
    const newSocket = io.connect(BASE_URL, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (prescriberId) => {
        dispatch(addDisabledPrescriber(prescriberId));
        onClickHandler(prescriberId, true);
      });
      socket.on("enable_prescriber", (prescriberId) => {
        dispatch(updateDisabledPrescriber(prescriberId));
      });
    }
  }, [socket]);

  const onClickHandler = async (prescriberId, flag) => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update_tele_prescriber_call_status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriberId: prescriberId,
            flagged: flag,
          }),
        }
      );
      const data = await response.json();
      console.log("DATA", data);
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  const onActionClick = (prescriberId) => {
    socket.emit("message", prescriberId);
  };

  const isActionDisabled = (prescriberId) => {
    return store.prescribers.disabledPrescribers[prescriberId];
  };

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
              disabled={isActionDisabled(row.Id) || row.isOnCall}
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
  const columns = [...defaultColumns];

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
