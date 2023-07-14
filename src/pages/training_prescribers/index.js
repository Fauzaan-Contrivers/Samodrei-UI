// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Delete from "mdi-material-ui/Delete";
import CreateTrainingPrescriber from "src/views/components/dialogs/DialogCreateTrainingPrescriber";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "src/configs/config";

// ** Icons Imports
import Snackbar from "@mui/material/Snackbar";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchTraingingPrescribersData } from "src/store/prescribers";
import { debounce } from "lodash";
import authConfig from "src/configs/auth";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Styled Components

import PrescriberEditDialog from "../prescribers/list/edit-dialog";
import EditIcon from "mdi-material-ui/Pencil";
import { Checkbox } from "@mui/material";

// ** Styled component for the link in the dataTable
const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

import { useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

/* eslint-enable */
const TrainingPrescribers = () => {
  // ** State

  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [openCreatePrescriberDialog, setOpenCreatePrescriberDialog] =
    useState(false);

  const [prescriber, setPrescriber] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const ability = useContext(AbilityContext);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  useEffect(() => {
    if (!openCreatePrescriberDialog) {
      setIsLoading(true);
      const fetchPrescribersDataWithDebounce = debounce(() => {
        dispatch(
          fetchTraingingPrescribersData({
            page_num: page + 1,
            page_limit: pageSize,
            clientId: userData.clientId,
          })
        ).then(() => {
          setIsLoading(false);
        });
      }, 2000);
      fetchPrescribersDataWithDebounce();
      return fetchPrescribersDataWithDebounce.cancel;
    }
  }, [page, pageSize, openCreatePrescriberDialog, isDeleted]);

  const handleClose = () => setOpen(false);

  const openDialog = (fields) => {
    setOpenCreatePrescriberDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreatePrescriberDialog(false);
  };

  const handleDeleteTrainingPrescriber = async (prescriberId) => {
    console.log(prescriberId);
    await axios
      .post(`${BASE_URL}prescriber/delete_prescriber`, {
        prescriberId: prescriberId,
        IsDeleted: true,
      })
      .then((res) => {
        if (res.data.status == 200) {
          toast.success(res.data.message, {
            duration: 2000,
          });
          setIsDeleted(true);
        }
      });
  };

  const defaultColumns = [
    {
      field: "name",
      minWidth: 180,
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
      minWidth: 90,
      field: "market_decile",
      headerName: "Edit",
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit Address">
            <EditIcon
              onClick={() => {
                setPrescriber(row), setOpen(true);
              }}
            />
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Delete">
              <Box>
                <IconButton
                  color="secondary"
                  size="small"
                  component="a"
                  sx={{ textDecoration: "none" }}
                  onClick={() => handleDeleteTrainingPrescriber(row.Id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
        </>
      ),
    },
  ];
  const columns = [...defaultColumns];

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
          <CreateTrainingPrescriber
            open={openCreatePrescriberDialog}
            handleClose={handleCloseDialog}
            fields={"{dialogFields}"}
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
              <CardHeader
                action={
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => openDialog("hi")}
                    >
                      Create Training Prescriber
                    </Button>
                  </Box>
                }
              />
              <DataGrid
                autoHeight
                pagination
                rows={
                  isLoading ? [] : store.prescribers.trainingPrescribersData
                }
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row?.Id}
                rowCount={store.prescribers.trainingPrescribersData.length}
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

TrainingPrescribers.acl = {
  action: "read",
  subject: "acl-page",
};

export default TrainingPrescribers;
