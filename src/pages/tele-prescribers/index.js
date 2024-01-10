import { useState, useEffect, useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Store & Actions Imports
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useDispatch, useSelector } from "react-redux";
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import toast from "react-hot-toast";

import {
  addDisabledPrescriber,
  fetchAllTelePrescribers,
  updateDisabledPrescriber,
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
import { onCallLogFilterChangeHandler } from "src/store/call_logs";

const TelePrescriber = () => {
  const [namePrescriber, setNamePrescriber] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogFields, setDialogFields] = useState([]);
  const [searchName, setSearchName] = useState("")
  const [update, setUpdate]=useState({
    phoneNumber:null,
    prescriberId:null,
    speciality: null
  })
  const ability = useContext(AbilityContext);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const { socket } = store.call_logs.filter;

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  const fetchLatest=()=>{
    const fetchPrescribersDataWithDebounce2 = debounce(() => {
      dispatch(
        fetchAllTelePrescribers({
          page_num: page + 1,
          page_size: pageSize,
        })
      ).then(() => {
        setIsLoading(false);
      });
    }, 1000);

    fetchPrescribersDataWithDebounce2();

    return fetchPrescribersDataWithDebounce2.cancel;
  }

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      const fetchPrescribersDataWithDebounce = debounce(() => {
        dispatch(
          fetchAllTelePrescribers({
            page_num: page + 1,
            page_size: pageSize,
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

    dispatch(
      onCallLogFilterChangeHandler({
        filter: "socket",
        value: newSocket,
      })
    );
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("disable_prescriber", (prescriberId) => {
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
    socket.emit("disable_prescriber", prescriberId);
  };

  const isActionDisabled = (prescriberId) => {
    return store.prescribers.disabledPrescribers[prescriberId];
  };

  const updatePhoneNumber=async (e)=>{
    e.preventDefault()
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update-tele-prescriber-number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriberId: update.prescriberId,
            phoneNumber: update.phoneNumber,
            speciality: update.speciality
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        toast.success(data.message);
        setOpen(false)
        fetchLatest()
      }
    } catch (error) {
      toast.error("Something went wrong, try again!")
      console.log("CHECK", error);
    }
  }

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
      minWidth: 210,
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
            <IconButton
              size="small"
              component="a"
              sx={{ textDecoration: "none", cursor: "pointer" }}
             onClick={() => {
              setUpdate({...update, phoneNumber:row?.Phone, prescriberId: row?.Id, speciality: row?.Specialty})
              setOpen(true)
             }}
              
            >
              <EyeOutline
                fontSize="small"
               
              />
            </IconButton>
        </Grid>
      ),
    },
    // {
    //   flex: 0.1,
    //   minWidth: 50,
    //   field: "Action",
    //   headerName: "Action",
    //   renderCell: ({ row }) => (
    //     <Grid container alignItems="center">
    //       <Link href={`/TelePrescriber/preview/${row.Id}`} passHref>
    //         <IconButton
    //           size="small"
    //           component="a"
    //           sx={{ textDecoration: "none", cursor: "pointer" }}
    //           onClick={() => onActionClick(row.Id)}
    //           disabled={isActionDisabled(row.Id) || row.isOnCall}
    //         >
    //           <EyeOutline
    //             fontSize="small"
    //             sx={{
    //               color:
    //                 isActionDisabled(row.Id) || row.isOnCall ? "red" : null,
    //             }}
    //           />
    //         </IconButton>
    //       </Link>
    //     </Grid>
    //   ),
    // },
  ];
  const columns = [...defaultColumns];

  const openShowPhoneNumberDialog = (prescriber) => {
    setOpen(true);
    setDialogFields(prescriber);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const fetchPrescribersOnName=()=>{
    dispatch(
      fetchAllTelePrescribers({
        page_num: page + 1,
        page_size: pageSize,
        Search: searchName
      })
    ).then(() => {
      setIsLoading(false);
    });
  }

  return (
    <>
        <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
          //  handleClose()
          }
        }}
      >
        <form onSubmit={updatePhoneNumber}>
        <DialogTitle id='alert-dialog-title'>{'Update Data'}</DialogTitle>
        <DialogContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container >
                <FormControl sx={{ width:400, mb:6}}>
              <TextField  required type='number' onChange={(e)=>setUpdate({...update, phoneNumber:e.target.value})} value={update?.phoneNumber}  id="standard-basic" name="phoneNumber" label="Phone Number" placeholder='Enter phone number' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:400, mb:6}}>
              <TextField  required type='text' onChange={(e)=>setUpdate({...update, speciality:e.target.value})} value={update?.speciality}  id="standard-basic" name="speciality" label="Speciality" placeholder='Enter speciality' variant="standard" />
            </FormControl>
        </Grid>
        </Grid>
        </Grid>
        </CardContent>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button onClick={()=>setOpen(false)}>Close</Button>
          <Button type="submit" variant='contained'>{'Update'}</Button>

        </DialogActions>
        </form>

        </Dialog>


    <div>
      {ability?.can("read", "acl-page") ? (
        <>
         <div style={{ display: "flex" }}>
            <div
              style={{
                marginBottom: "10px",
                width: "200px",
                marginLeft: "10px",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Search by Name"
                variant="outlined"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                }}
              />
            </div>

            <Button
              onClick={fetchPrescribersOnName}
              variant="outlined"
              style={{ height: "55px", position: "absolute", right: 150 }}
            >
              Go
            </Button>
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
                pageSize={Number(pageSize)}
                rowsPerPageOptions={[20, 30, 50]}
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
    </>
  );
};

TelePrescriber.acl = {
  action: "read",
  subject: "acl-page",
};

export default TelePrescriber;
