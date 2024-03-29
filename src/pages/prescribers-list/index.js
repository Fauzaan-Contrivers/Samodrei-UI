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
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Delete from "mdi-material-ui/Delete";
import toast from "react-hot-toast";
import EyeOutline from "mdi-material-ui/EyeOutline";

import CreateListDialog from "src/views/components/dialogs/DialogCreateList";
import DialogViewCustomList from "src/views/components/dialogs/DialogViewCustomList";

const PrescribersList = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);

  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("desc");
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [listId, setListId] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogFields, setDialogFields] = useState("");

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  // ** Hooks
  const ability = useContext(AbilityContext);

  const handleViewList = (listId) => {
    setOpenView(true);
    setListId(listId);
  };

  const handleDeleteList = async (id) => {
    await axios
      .post(`${BASE_URL}prescriber/delete_prescribers_list`, {
        id,
      })
      .then((res) => {
        if (res.data.status == 200) {
          toast.success(res.data.message, {
            duration: 2000,
          });
        }
      });
    fetchTableData(sort, sortColumn, userData);
  };

  const columns = [
    {
      flex: 0.2,
      minWidth: 30,
      headerName: "List Name",
      field: "List_Name",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.List_Name}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 50,
      headerName: "Actions",
      field: "Actions",
      renderCell: (params) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Delete">
              <Box>
                <IconButton
                  color="secondary"
                  size="small"
                  component="a"
                  sx={{ textDecoration: "none" }}
                  onClick={() => handleDeleteList(params.row.Id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="View">
              <Box>
                <IconButton
                  size="small"
                  component="a"
                  sx={{ textDecoration: "none" }}
                  onClick={() => handleViewList(params.row.Id)}
                >
                  <EyeOutline fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
        </>
      ),
    },
  ];

  const fetchTableData = useCallback(
    async (sort, column, userData) => {
      setIsLoading(true);
      await axios
        .get(`${BASE_URL}prescriber/get_prescribers_list_name`, {
          params: {
            sort,
            column,
            clientId: userData?.clientId,
          },
        })
        .then((res) => {
          setTotal(res.data.prescribersListName.length);
          setRows(res.data.prescribersListName);
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, userData);
  }, [fetchTableData, sort, sortColumn, open]);

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

  const handleCloseViewDialog = () => {
    setOpenView(false);
  };

  return (
    <Card>
      <>
        <DialogViewCustomList
          open={openView}
          handleClose={handleCloseViewDialog}
          listId={listId}
        />
        <CreateListDialog
          open={open}
          handleClose={handleCloseDialog}
          fields={dialogFields}
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
                  onClick={() => openDialog("CREATE PRESCRIBER'S LIST")}
                >
                  Create List
                </Button>
              ) : null}
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
          loading={isLoading}
          sortingMode="server"
          paginationMode="server"
          onSortModelChange={handleSortModel}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row?.Id}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </>
    </Card>
  );
};

export default PrescribersList;
