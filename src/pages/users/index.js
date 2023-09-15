// ** React Imports
import { useCallback, useContext, useState, useEffect } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";
import axios from "axios";
import { BASE_URL } from "src/configs/config";

// ** Config
import authConfig from "src/configs/auth";

// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Check from "mdi-material-ui/Check";
import Close from "mdi-material-ui/Close";
import ServerSideToolbar from "src/views/table/data-grid/ServerSideToolbar";
import MyDialog from "src/views/components/dialogs/UserDialog";

const RegisteredUsers = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [company, setCompany] = useState([]);

  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("desc");
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogFields, setDialogFields] = useState("");

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

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
      minWidth: 250,
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
      minWidth: 180,
      headerName: "Role",
      field: "roleId",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.roleId === 1
            ? "Super Admin"
            : params.row.roleId === 4
            ? "Tele-Marketer"
            : params.row.roleId === 5
            ? "Tele-Marketer (Manager)"
            : "Admin"}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: "Company Name",
      field: "company_name",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.company_name}
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
    async (sort, column, userData) => {
      if (!open) {
        setIsLoading(true);

        await axios
          .get(`${BASE_URL}user/users`, {
            params: {
              sort,
              column,
              clientId: userData?.clientId,
            },
          })
          .then((res) => {
            setTotal(res.data.users.length);
            setRows(loadServerRows(page, res.data.users));
            setCompany(res.data.company);
            setIsLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, userData);
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

  const openDialog = (fields) => {
    setOpen(true);
    setDialogFields(fields);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Card>
      <>
        <MyDialog
          open={open}
          handleClose={handleCloseDialog}
          fields={dialogFields}
          company={company}
        />
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
          action={
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {userData.roleId == 1 || userData.roleId == 3 ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => openDialog("INVITE USER")}
                >
                  Invite New User
                </Button>
              ) : null}

              {userData.clientId == 1 ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => openDialog("REGISTER COMPANY")}
                >
                  REGISTER COMPANY
                </Button>
              ) : null}
            </Box>
          }
        />
        <DataGrid
          autoHeight
          pagination
          rows={isLoading ? [] : rows}
          rowCount={total}
          columns={columns}
          pageSize={pageSize}
          loading={isLoading}
          sortingMode="server"
          paginationMode="server"
          onSortModelChange={handleSortModel}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row?.id}
          onPageChange={(newPage) => setPage(newPage)}
          components={{ Toolbar: ServerSideToolbar }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </>
    </Card>
  );
};

export default RegisteredUsers;
