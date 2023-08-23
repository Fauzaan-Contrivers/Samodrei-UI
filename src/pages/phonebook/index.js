import { useState, useEffect, useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescribersforPhoneLogs } from "src/store/prescribers";
import { debounce } from "lodash";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DialogShowPhone from "src/views/components/dialogs/DialogShowPhone";
import io from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Next Import
import Link from "next/link";

const PhoneBook = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogFields, setDialogFields] = useState([]);
  const [socket, setSocket] = useState(null);

  const ability = useContext(AbilityContext);

  // useEffect(() => {
  //   const newSocket = io.connect("http://localhost:80", {
  //     transports: ["websocket"],
  //   });
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("message", (data) => {
  //       console.log("Received data:", data);
  //     });
  //   }
  // }, [socket]);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      const fetchPrescribersDataWithDebounce = debounce(() => {
        dispatch(
          fetchPrescribersforPhoneLogs({
            page_num: page + 1,
            page_size: pageSize,
            name: store.prescribers.filter.name,
            state: store.prescribers.filter.State,
            is_soaanz_prescriber: store.prescribers.filter.is_soaanz_prescriber,
            clientId: userData.clientId,
          })
        ).then(() => {
          setIsLoading(false);
        });
      }, 2000);

      fetchPrescribersDataWithDebounce();

      return fetchPrescribersDataWithDebounce.cancel;
    }
  }, [page, pageSize]);

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
        setDisabledPrescribers((prevDisabledPrescribers) => ({
          ...prevDisabledPrescribers,
          [prescriberId]: true,
        }));
      });
    }
  }, [socket]);

  const onActionClick = (prescriberId) => {
    socket.emit("message", prescriberId);
  };

  const isActionDisabled = (prescriberId) => {
    return disabledPrescribers[prescriberId];
  };

  const defaultColumns = [
    {
      field: "name",
      minWidth: 210,
      headerName: "Name",
      renderCell: ({ row }) => (
        <Typography variant="body2">{`${row?.Name}`}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: "prescriber_address",
      headerName: "Address",
      renderCell: ({ row }) => (
        <Tooltip
          title={`${row.Street_Address}, ${row.City}, ${row.State}, ${row.Zip}`}
        >
          <Typography variant="body2">
            {`${row.Street_Address}, ${row.City}, ${row.State}, ${row.Zip}`}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.2,
      minWidth: 310,
      field: "Speciality",
      headerName: "Speciality",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Speciality || ""}</Typography>
      ),
    },
    {
      flex: 0.2,
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
              onClick={() => openClickHandler(row.Id)}
            >
              <EyeOutline fontSize="small" />
            </IconButton>
          </Link>
        </Grid>
      ),
    },
  ];
  const columns = [...defaultColumns];

  const openShowPhoneNumberDialog = (prescriber) => {
    // if (socket) {
    setOpen(true);
    setDialogFields(prescriber);
    // socket.emit("message", prescriber);
    // }
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const openClickHandler = async (phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}prescriber/add_call_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telemarketerId: userData.id,
          prescriberId: phoneNumber,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <>
          <DialogShowPhone
            open={open}
            handleClose={handleCloseDialog}
            prescriber={dialogFields}
          />
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
