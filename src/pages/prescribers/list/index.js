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
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import Select from "@mui/material/Select";

// ** Icons Imports
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
import Snackbar from "@mui/material/Snackbar";
// ** Third Party Imports
import format from "date-fns/format";
import DatePicker from "react-datepicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescribersData } from "src/store/prescribers";
import { debounce } from "lodash";
import authConfig from "src/configs/auth";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import TableHeader from "src/views/apps/invoice/list/TableHeader";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { onPrescriberFilterChangeHandler } from "src/store/prescribers";
import PrescriberEditDialog from "./edit-dialog";
import EditIcon from "mdi-material-ui/Pencil";
import { Checkbox } from "@mui/material";
// import EditIcon from '@mui/icons-material/Edit';

// ** Styled component for the link in the dataTable
const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

import { useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

/* eslint-enable */
const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [statusValue, setStatusValue] = useState("");
  const [endDateRange, setEndDateRange] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [states, setStates] = useState([]);
  const [open, setOpen] = useState(false);
  const [prescriber, setPrescriber] = useState({});
  const [presName, setPresName] = useState("");
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoaanz, setIsSoaanz] = useState("");
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
        fetchPrescribersData({
          page_num: page + 1,
          page_size: pageSize,
          name: store.prescribers.filter.name,
          state: store.prescribers.filter.State,
          is_soaanz_prescriber: store.prescribers.filter.is_soaanz_prescriber,
          clientId: userData.clientId,
        })
      ).then(() => {
        filterAllStates();
        setIsLoading(false);
      });
    }, 2000);

    fetchPrescribersDataWithDebounce();

    return fetchPrescribersDataWithDebounce.cancel;
  }, [page, pageSize, store.prescribers.filter]);

  const filterAllStates = () => {
    var state = [];
    store.prescribers.data.forEach((pres) => {
      const index = state.findIndex((st) => st == pres.State);
      if (index == -1) {
        state.push(pres.State);
      }
    });
    setStates(state);
  };

  const handleFilter = (val) => {
    setValue(val);
  };

  const handleStatusValue = (e) => {
    setStatusValue(e.target.value);
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDates(dates);
    }
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const handleStateChangeHandler = (e) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "State",
        value: e.target.value,
      })
    );
  };

  const handleSoaanzStateChangeHandler = (e) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "is_soaanz_prescriber",
        value: e.target.value,
      })
    );
  };

  const handlePrescriberNameChangeHandler = (e) => {
    dispatch(
      onPrescriberFilterChangeHandler({ filter: "name", value: e.target.value })
    );
  };

  const defaultColumns = [
    {
      field: "name",
      minWidth: 210,
      headerName: "Name",
      renderCell: ({ row }) => (
        <Link href={`/prescribers/preview/${row.Id}`} passHref>
          <StyledLink>{`${row?.Name}`}</StyledLink>
        </Link>
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
      minWidth: 140,
      field: "VisitCount",
      headerName: "Visit Count",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.VisitCount || ""}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: "Furosemide_Trx",
      headerName: "Furosemide trx",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Furosemide_Trx || ""}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 155,
      field: "is_soaanz_prescriber",
      headerName: "Is Writing Soaanz",
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {" "}
          <Checkbox
            checked={row?.is_soaanz_prescriber ? true : false}
            disabled
          />
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: "market_decile",
      headerName: "Market Decile",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.market_decile || ""}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 70,
      field: "market_decile",
      headerName: "Edit",
      renderCell: ({ row }) => (
        <EditIcon
          onClick={() => {
            setPrescriber(row), setOpen(true);
          }}
        />
      ),
    },
  ];
  const columns = [...defaultColumns];

  // if (userData.roleId == 1) {
  //   const companyNameColumn = {
  //     flex: 0.2,
  //     minWidth: 150,
  //     field: "company_name",
  //     headerName: "Company Name",
  //     renderCell: ({ row }) => <Typography variant="body2">{""}</Typography>,
  //   };

  //   const insertIndex = 3;
  //   columns.splice(insertIndex, 0, companyNameColumn);
  // }

  const [snackOpen, setSnackOpen] = useState(false);
  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <Grid container spacing={6}>
          <PrescriberEditDialog
            prescriber={prescriber}
            onPrescriberUpdate={() => {
              setSnackOpen(true);
              setOpen(false);
            }}
            open={open}
            handleClose={handleClose}
          />
          <Snackbar
            open={snackOpen}
            onClose={() => setSnackOpen(false)}
            message="Address updated successfully."
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          />

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Filters" />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status-select">State</InputLabel>
                      <Select
                        fullWidth
                        value={store.prescribers.filter.State}
                        sx={{ mr: 4, mb: 2 }}
                        label="State"
                        onChange={handleStateChangeHandler}
                        labelId="meet-with-select"
                      >
                        <MenuItem value="">Select State</MenuItem>
                        {store?.prescribers?.states &&
                          store?.prescribers?.states.map((item, index) => (
                            <MenuItem key={`state-${index}`} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth>
                      <TextField
                        value={store.prescribers.filter.name}
                        id="outlined-basic"
                        label="Prescriber Name"
                        onChange={handlePrescriberNameChangeHandler}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status-select">
                        Is Soaanz Prescriber
                      </InputLabel>
                      <Select
                        fullWidth
                        value={store.prescribers.filter.is_soaanz_prescriber}
                        sx={{ mr: 4, mb: 2 }}
                        label="State"
                        onChange={handleSoaanzStateChangeHandler}
                        labelId="meet-with-select"
                      >
                        <MenuItem value="">Select State</MenuItem>
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">Not</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <DataGrid
                autoHeight
                pagination
                rows={isLoading ? [] : store.prescribers.data}
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
        </Grid>
      ) : null}
    </div>
  );
};

InvoiceList.acl = {
  action: "read",
  subject: "acl-page",
};

export default InvoiceList;
