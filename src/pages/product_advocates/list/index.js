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

// ** Config
import authConfig from "src/configs/auth";

// ** Third Party Imports
import format from "date-fns/format";
import DatePicker from "react-datepicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchData, deleteInvoice } from "src/store/apps/invoice";
import { debounce } from "lodash";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import TableHeader from "src/views/apps/invoice/list/TableHeader";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

import { useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import {
  onUpdateProductAdvocateStatusUpdateHandler,
  onProductAdvocateStatusChangeHandler,
  updateProductAdvocateStatus,
  fetchProductAdvocatesData,
} from "src/store/product_advocates";
import ProductAdvocateAddSampleQuantity from "src/views/product_advocates/ProductAdvocateAddSampleQuantity";
import { status } from "nprogress";
import { id } from "date-fns/locale";

// ** Styled component for the link in the dataTable
const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

/* eslint-enable */
const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [statusValue, setStatusValue] = useState("");
  const [showSampleQuantity, setShowSampleQuantity] = useState("");
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState("");
  const [name_email, setNameEmail] = useState("");
  const ability = useContext(AbilityContext);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  useEffect(() => {
    const userData = JSON.parse(
      window.localStorage.getItem(authConfig.userData)
    );
    console.log("ussseeeeeeeeeeeeeeeeer", userData.roleId);
    const fetchProductAdvocates = debounce(() => {
      if (
        store.product_advocates.totalRecords ||
        store.product_advocates.data
      ) {
        let page_size = pageSize;
        if (pageSize * (page + 1) > store.product_advocates.totalRecords) {
          const Remain =
            pageSize * (page + 1) - store.product_advocates.totalRecords;
          page_size = pageSize - Remain;
        }
        setIsLoading(true);
        if (name_email?.length == 0) {
          page_size = pageSize;
        }
        dispatch(
          fetchProductAdvocatesData({
            page_num: page + 1,
            page_size: page_size,
            active_status: store.product_advocates.filter.Active,
            name_email: store.product_advocates.filter.ProductAdvocateValue,
            clientId: userData.roleId,
          })
        ).then(() => setIsLoading(false));
      }
    }, 2000); // 2000ms debounce time

    fetchProductAdvocates();

    return () => fetchProductAdvocates.cancel(); // cancel pending debounced invocation on unmount or re-render
  }, [pageSize, page, store.product_advocates.filter, name_email]);

  const handleFilter = (val) => {
    setValue(val);
  };
  const handleStatusValue = (e) => {
    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "Active",
        value: e.target.value,
      })
    );
  };

  const handleProductAdvocateValue = (e) => {
    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "ProductAdvocateValue",
        value: e.target.value,
      })
    );
  };

  const handleSubView = (event, userId) => {
    const selectedValues = event.target.value;
    if (selectedValues.includes("All")) {
      handleSubViewUpdateHandler(userId, "All");
    } else {
      handleSubViewUpdateHandler(userId, selectedValues.join(";"));
    }
    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "sub_view",
        value: selectedValues,
      })
    );
  };

  const handlePreview = (e, userId) => {
    handlePreviewUpdateHandler(userId, e.target.value);
    dispatch(
      onProductAdvocateStatusChangeHandler({
        filter: "preview",
        value: e.target.value,
      })
    );
  };

  const handleStatusUpdateHandler = (product_advocate_id, Active) => {
    console.log(Active);

    if (Active == "0") {
      console.log("ACTIVE", Active);
      Active = "1";
    } else {
      Active = "0";
    }
    // Call the update API
    const data = {
      product_advocate_id: product_advocate_id,
      Active: Active,
    };
    dispatch(updateProductAdvocateStatus(data));
    setNameEmail("");
  };

  const handlePreviewUpdateHandler = (product_advocate_id, Preview) => {
    // Call the update API
    const data = {
      product_advocate_id: product_advocate_id,
      Preview: Preview,
    };
    dispatch(updateProductAdvocateStatus(data));
  };

  const handleSubViewUpdateHandler = (product_advocate_id, SubView) => {
    // Call the update API
    const data = {
      product_advocate_id: product_advocate_id,
      SubView: SubView,
    };
    dispatch(updateProductAdvocateStatus(data));
  };

  const RowOptions = ({ row }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    return (
      <Fragment>
        <IconButton size="small" onClick={handleRowOptionsClick}>
          <DotsVertical fontSize="small" />
        </IconButton>
        <Menu
          keepMounted
          disablePortal
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleStatusUpdateHandler(row?.Id, row?.Active);
              handleRowOptionsClose();
            }}
          >
            {!row?.Active == "0" ? (
              <Check sx={{ fontSize: "1rem" }} />
            ) : (
              <Close sx={{ fontSize: "1rem" }} />
            )}
            <span style={{ marginLeft: "4px" }}>
              {row?.Active == "1" ? "Inactive" : "Active"}
            </span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setShowSampleQuantity(true);
              setSelectedRow(row);
            }}
          >
            Add Sample Quantity
          </MenuItem>
        </Menu>
      </Fragment>
    );
  };

  const defaultColumns = [
    {
      field: "name",
      minWidth: 200,
      headerName: "Name",
      renderCell: ({ row }) => (
        <Link href={`/product_advocates/preview/${row.Id}`} passHref>
          <StyledLink>{`${row?.Name}`}</StyledLink>
        </Link>
      ),
    },
    {
      flex: 0.2,
      minWidth: 220,
      field: "email",
      headerName: "Email",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Email || ""}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: "Phone",
      headerName: "Phone",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Phone || ""}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: "Stock_20",
      headerName: "Total 20 MG",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Stock_20 || "0"}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: "Stock_60",
      headerName: "Total 60 MG",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.Stock_60 || "0"}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 80,
      field: "Active",
      headerName: "Active",
      renderCell: ({ row }) => (
        <CustomAvatar
          skin="light"
          color={row?.Active == "1" ? "success" : "error"}
          sx={{ width: "1.875rem", height: "1.875rem" }}
        >
          {row?.Active == "1" ? (
            <Check sx={{ fontSize: "1rem" }} />
          ) : (
            <Close sx={{ fontSize: "1rem" }} />
          )}
        </CustomAvatar>
      ),
    },
    {
      flex: 0.2,
      minWidth: 80,
      field: "Admin",
      headerName: "Admin",
      renderCell: ({ row }) => (
        <CustomAvatar
          skin="light"
          color={row?.Admin ? "success" : "error"}
          sx={{ width: "1.875rem", height: "1.875rem" }}
        >
          {row?.Admin ? (
            <Check sx={{ fontSize: "1rem" }} />
          ) : (
            <Close sx={{ fontSize: "1rem" }} />
          )}
        </CustomAvatar>
      ),
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: "Preview",
      headerName: "Preview",
      renderCell: ({ row }) => {
        return (
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="standard" sx={{ border: "none" }}>
              <Select
                fullWidth
                label="Advocate Preview"
                onChange={(e) => {
                  handlePreview(e, row?.Id);
                }}
                labelId="invoice-status-select"
                value={row?.Preview || ""}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="SOAANZ">SOAANZ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: "SubView",
      headerName: "Sub View",
      renderCell: ({ row }) => {
        const subView = row?.SubView?.split(";").map(
          (subView) => subView + " "
        );
        return (
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="standard" sx={{ border: "none" }}>
              <Select
                fullWidth
                // sx={{ mr: 4, mb: 2 }}
                label="Advocate Sub View"
                onChange={(e) => {
                  handleSubView(e, row?.Id);
                }}
                labelId="invoice-status-select"
                value={
                  store.product_advocates.filter.sub_view ||
                  row?.SubView?.split(";")?.map((subView) => subView + " ")
                }
                renderValue={() => subView}
                multiple
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Dispense">Dispense</MenuItem>
                <MenuItem value="Reverse">Reverse</MenuItem>
                <MenuItem value="Reject">Reject</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 90,
      sortable: false,
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="View">
            <Box>
              <Link href={`/product_advocates/preview/${row.Id}`} passHref>
                <IconButton
                  size="small"
                  component="a"
                  sx={{ textDecoration: "none" }}
                >
                  <EyeOutline fontSize="small" />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
          <RowOptions row={row} />
        </Box>
      ),
    },
  ];

  const columns = [...defaultColumns];

  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Filters" />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="invoice-status-select">Status</InputLabel>
                      <Select
                        fullWidth
                        sx={{ mr: 4, mb: 2 }}
                        label="Advocate Status"
                        onChange={handleStatusValue}
                        labelId="invoice-status-select"
                        value={store.product_advocates.filter.Active}
                      >
                        <MenuItem value="">
                          Select Product Advocate Status
                        </MenuItem>
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth>
                      <TextField
                        value={
                          store.product_advocates.filter.ProductAdvocateValue
                        }
                        id="outlined-basic"
                        label="Search By Name or Email"
                        onChange={handleProductAdvocateValue}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              {Boolean(selectedRow) && Boolean(showSampleQuantity) && (
                <ProductAdvocateAddSampleQuantity
                  open={showSampleQuantity}
                  row={selectedRow}
                  handleClose={() => setShowSampleQuantity(false)}
                />
              )}
              <DataGrid
                autoHeight
                pagination
                rows={isLoading ? [] : store.product_advocates.data}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.Id}
                // checkboxSelection
                rowCount={store.product_advocates.totalRecords}
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
