// ** React Imports
import { useCallback, useContext, useState, useEffect } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";
import axios from "axios";
import { BASE_URL } from "src/configs/config";

// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import UserTableToolbar from "src/views/table/data-grid/UserTableToolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import Check from "mdi-material-ui/Check";
import Close from "mdi-material-ui/Close";

const RegisteredUsers = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("desc");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    roleId: 1,
  });

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  // ** Hooks
  const ability = useContext(AbilityContext);

  const columns = [
    {
      flex: 0.2,
      minWidth: 70,
      headerName: "ID",
      field: "id",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.id}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: "Name",
      field: "name",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.name}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 440,
      headerName: "Email",
      field: "email",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.email}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: "Active",
      field: "is_active",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.is_active ? (
            <Check sx={{ fontSize: "1rem" }} />
          ) : (
            <Close sx={{ fontSize: "1rem" }} />
          )}
        </Typography>
      ),
    },
  ];

  const fetchTableData = useCallback(
    async (sort, column) => {
      await axios
        .get(`${BASE_URL}user/users`, {
          body: {
            sort,
            column,
          },
        })
        .then((res) => {
          console.log(res.data);
          setTotal(res.data.length);
          setRows(loadServerRows(page, res.data));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn);
  }, [fetchTableData, sort, sortColumn]);

  const handleSortModel = (newModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);
      fetchTableData(newModel[0].sort, newModel[0].field);
    } else {
      setSort("DESC");
      setSortColumn("id");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}user/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const data = await response.json();
      console.log("DATA", data);
      if (data.status == 200) {
        toast.success(data.message, {
          duration: 2000,
        });
        fetchTableData();
      }

      if (data.status == 400) {
        toast.error(data.message, {
          duration: 2000,
        });
      }
      handleClose();
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card>
      <>
        <Dialog
          open={open}
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              handleClose();
            }
          }}
          PaperProps={{
            style: {
              width: "fit-content",
              maxWidth: "100%",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">ADD USER</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogActions className="dialog-actions-dense">
              <FormControl sx={{ width: 550, padding: 5, mb: 1 }}>
                <FormControl sx={{ width: 500, padding: 5, mb: 1 }}>
                  <TextField
                    required
                    type="text"
                    value={state.name}
                    onChange={handleChange}
                    id="standard-basic"
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                    variant="standard"
                  />
                  <TextField
                    required
                    type="email"
                    value={state.email}
                    onChange={handleChange}
                    id="standard-basic"
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    variant="standard"
                  />
                </FormControl>
                <FormControl sx={{ width: 500, padding: 5, mb: 1 }}>
                  <Button type="submit" variant="contained">
                    Add
                  </Button>
                  <Button onClick={handleClose}>Discard</Button>
                </FormControl>
              </FormControl>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          open={snackOpen}
          onClose={() => {
            setSnackOpen(false);

            fetchTableData(sort, sortColumn);
          }}
          message="Address updated successfully."
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
        <CardHeader
          title="Registered Users"
          action={
            <Box>
              <Button
                size="small"
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Invite
              </Button>
            </Box>
          }
        />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns={columns}
          pageSize={pageSize}
          sortingMode="server"
          paginationMode="server"
          onSortModelChange={handleSortModel}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row?.id}
          onPageChange={(newPage) => setPage(newPage)}
          components={{ Toolbar: UserTableToolbar }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </>
    </Card>
  );
};

export default RegisteredUsers;
