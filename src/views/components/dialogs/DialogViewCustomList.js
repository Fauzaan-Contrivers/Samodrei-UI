import { useEffect, useState, useCallback } from "react";

// ** Next Import
import Link from "next/link";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

import axios from "axios";
import { BASE_URL } from "src/configs/config";

// ** Styled component for the link in the dataTable
const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const DialogViewCustomList = ({ open, handleClose, listId }) => {
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("Id");
  const [prescriber, setPrescriber] = useState([]);
  const [total, setTotal] = useState(0);

  console.log("cheeeeeeeeeee", listId);

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  const fetchTableData = useCallback(
    async (sort, column, listId) => {
      setIsLoading(true);
      await axios
        .post(`${BASE_URL}prescriber/get_prescribers_list`, {
          listId: listId,
        })
        .then((res) => {
          console.log(res.data);
          setRows(loadServerRows(page, res.data.prescribersList));
          setTotal(res.data.prescribersList.length);
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, listId);
  }, [fetchTableData, sort, sortColumn, listId]);

  const handleSortModel = (newModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);
    } else {
      setSort("DESC");
      setSortColumn("id");
    }
  };

  const columns = [
    {
      flex: 0.1,
      minWidth: 200,
      headerName: "Name",
      field: "Name",
      renderCell: (params) => (
        <Link href={`/prescribers/preview/${params.row.Id}`} passHref>
          <StyledLink>{`${params.row.Name}`}</StyledLink>
        </Link>
      ),
    },
    {
      flex: 0.1,
      minWidth: 450,
      field: "Street_Address",
      headerName: "Address",
      renderCell: (params) => (
        <Tooltip
          title={`${params.row.Street_Address}, ${params.row.City}, ${params.row.State}, ${params.row.Zip}`}
        >
          <Typography variant="body2">
            {`${params.row.Street_Address}, ${params.row.City}, ${params.row.State}, ${params.row.Zip}`}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: "Speciality",
      headerName: "Speciality",
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.Professional_Concentration
            ? params.row?.Professional_Concentration
            : params.row?.Speciality}
        </Typography>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          width: "860px",
          height: "860px",
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">Prescriber List</DialogTitle>
      <DataGrid
        autoHeight
        pagination
        rows={isLoading ? [] : rows}
        rowCount={total}
        columns={columns}
        pageSize={pageSize} // Set the pageSize to 10
        loading={isLoading}
        sortingMode="server"
        paginationMode="server"
        onSortModelChange={handleSortModel}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row?.Id}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      />
      <FormControl sx={{ padding: 5, mb: 1 }}>
        {/* <Button type="submit" variant="contained" sx={{ mt: 1, mb: 1 }}>
          Add
        </Button> */}
        <Button onClick={handleClose} sx={{ mt: 1, mb: 1 }}>
          Close
        </Button>
      </FormControl>
    </Dialog>
  );
};

export default DialogViewCustomList;
