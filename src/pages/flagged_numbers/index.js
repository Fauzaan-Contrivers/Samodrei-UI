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
import moment from "moment";

// ** Config
import authConfig from "src/configs/auth";
import DialogUpdateFlagNumber from "src/views/components/dialogs/DialogUpdateFlagNumber";

const FlaggedNumbers = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("asc");
  const [prescriberId, setPrescriberId] = useState({});
  const [open, setOpen] = useState(false);

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
      headerName: "Id",
      field: "Id",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.Id}
        </Typography>
      ),
    },
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
      minWidth: 60,
      field: "edit",
      headerName: "Edit",
      renderCell: ({ row }) => (
        <EditIcon
          onClick={() => {
            setPrescriberId(row.Id), setOpen(true);
          }}
        />
      ),
    },
  ];

  const fetchTableData = useCallback(
    async (sort, column, clientId, open) => {
      if (!open) {
        setIsLoading(true);
        await axios
          .post(`${BASE_URL}tele-prescribers/get_prescriber_flagged_number`, {
            sort,
            column,
            clientId,
          })
          .then((res) => {
            setTotal(res.data.prescribers.length);
            setRows(loadServerRows(page, res.data.prescribers));
            setIsLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, open]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, userData.clientId, open);
  }, [fetchTableData, sort, sortColumn, open]);

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
  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Card>
      <>
        <DialogUpdateFlagNumber
          open={open}
          handleClose={handleCloseDialog}
          prescriberId={prescriberId}
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
