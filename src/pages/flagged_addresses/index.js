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
import EditIcon from "mdi-material-ui/Pencil";
import ServerSideToolbar from "src/views/table/data-grid/ServerSideToolbar";
import PrescriberEditDialog from "../prescribers/list/edit-dialog";
import Snackbar from "@mui/material/Snackbar";

const FlaggedAddresses = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("asc");
  const [prescriber, setPrescriber] = useState({});
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [snackOpen, setSnackOpen] = useState(false);

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
      field: "Id",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.Id}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: "Name",
      field: "Name",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.Name}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 440,
      headerName: "Flagged Addresses",
      field: "Street_Address",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {`${params.row.Street_Address},${params.row.City},${params.row.State}`}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 60,
      field: "address",
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

  const fetchTableData = useCallback(
    async (sort, column) => {
      await axios
        .post(`${BASE_URL}prescriber/get_prescriber_flagged_address`, {
          params: {
            sort,
            column,
          },
        })
        .then((res) => {
          setTotal(res.data.prescribers.length);
          setRows(loadServerRows(page, res.data.prescribers));
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
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field);
    } else {
      setSort("asc");
      setSortColumn("id");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    fetchTableData(sort, value, sortColumn);
  };

  return (
    <Card>
      <>
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
          onClose={() => {
            setSnackOpen(false);

            fetchTableData(sort, sortColumn);
          }}
          message="Address updated successfully."
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
        <CardHeader title="Flagged Addresses List" />
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
          getRowId={(row) => row?.Id}
          onPageChange={(newPage) => setPage(newPage)}
          components={{ Toolbar: ServerSideToolbar }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          componentsProps={{
            toolbar: {
              value: searchValue,
              clearSearch: () => handleSearch(""),
              onChange: (event) => handleSearch(event.target.value),
            },
          }}
        />
      </>
    </Card>
  );
};

export default FlaggedAddresses;
