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
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";

// ** Config
import authConfig from "src/configs/auth";

const FlaggedNumbers = () => {
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
  const [isLoading, setIsLoading] = useState(false);

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
      headerName: "NPI",
      field: "NPI",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.NPI}
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
          {`${params.row.First_Name} ${params.row.Last_Name}`}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Flagged Number",
      field: "Phone",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.Phone}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: "Flagged Date",
      field: "FlaggedPhoneNumberDate",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.FlaggedPhoneNumberDate
            ? moment(params.row.FlaggedPhoneNumberDate)
                .local()
                .format("YYYY-MM-DD HH:mm:ss")
            : " "}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 280,
      headerName: "Comment",
      field: "CallFeedback",
      renderCell: (params) => (
        <Tooltip title={params.row.CallFeedback}>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {params.row.CallFeedback}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  const fetchTableData = useCallback(
    async (sort, column, clientId) => {
      setIsLoading(true);
      await axios
        .post(`${BASE_URL}tele-prescribers/get_prescriber_flagged_number`, {
          sort,
          column,
          clientId,
        })
        .then((res) => {
          setTotal(res.data.prescribers.length);
          console.log("CHEEEEEEEEEEECK", res.data.prescribers);
          setRows(loadServerRows(page, res.data.prescribers));
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, userData.clientId);
  }, [fetchTableData, sort, sortColumn]);

  const handleSortModel = (newModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);
      fetchTableData(
        newModel[0].sort,
        searchValue,
        newModel[0].field,
        userData.clientId
      );
    } else {
      setSort("asc");
      setSortColumn("id");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    fetchTableData(sort, value, sortColumn, userData.clientId);
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

            fetchTableData(sort, sortColumn, userData.clientId);
          }}
          message="Address updated successfully."
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
        <CardHeader title="Flagged Numbers List" />
        <DataGrid
          autoHeight
          pagination
          rows={isLoading ? [] : rows}
          rowCount={total}
          columns={columns}
          pageSize={pageSize}
          sortingMode="server"
          paginationMode="server"
          loading={isLoading}
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

export default FlaggedNumbers;
