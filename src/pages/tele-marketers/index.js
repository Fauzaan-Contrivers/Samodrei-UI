// ** React Imports
import { useCallback, useState, useEffect } from "react";

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
import toast from "react-hot-toast";

const TeleMarketers = () => {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("desc");
  const [open, setOpen] = useState(false);
  const [dialogFields, setDialogFields] = useState("");
  const [company, setCompany] = useState([]);
  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  const fetchTableData = useCallback(
    async (sort, column, userData) => {
      if (!open) {
        setIsLoading(true);

        await axios
          .get(`${BASE_URL}user/tele-marketer-users`, {
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

  const handleStatusUpdateHandler = async (
    tele_marketer_id,
    is_active,
    is_verified
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}user/disable-tele-marketer-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tele_prescriber_id: tele_marketer_id,
            is_active: is_active,
            is_verified: is_verified,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        toast.success(data.message, {
          duration: 2000,
        });
        fetchTableData(sort, sortColumn, userData);
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  };

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
    {
      flex: 0.2,
      minWidth: 140,
      headerName: "Actions",
      field: "action",
      renderCell: (params) => (
        <>
          {params.row.is_active ? (
            <Button
              onClick={() =>
                handleStatusUpdateHandler(
                  params.row.id,
                  !params.row.is_active,
                  false
                )
              }
            >
              <Typography variant="body2" sx={{ color: "red" }}>
                Inactive
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleStatusUpdateHandler(
                  params.row.id,
                  !params.row.is_active,
                  true
                )
              }
            >
              <Typography variant="body2" sx={{ color: "green" }}>
                Active
              </Typography>
            </Button>
          )}
        </>
      ),
    },
  ];

  const openDialog = (fields) => {
    setOpen(true);
    setDialogFields(fields);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <MyDialog
        open={open}
        handleClose={handleCloseDialog}
        fields={dialogFields}
        company={company}
      />
      <Card>
        <CardHeader
          action={
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {userData.roleId == 1 || userData.roleId == 3 ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => openDialog("INVITE TELE-MARKETER")}
                >
                  INVITE TELE-MARKETER
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
      </Card>
    </>
  );
};

export default TeleMarketers;
