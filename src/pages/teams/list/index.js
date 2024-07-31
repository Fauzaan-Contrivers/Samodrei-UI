import { useState, useEffect, forwardRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { BASE_URL } from "src/configs/config";

// ** Axios for API call
import axios from "axios";

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth inputRef={ref} {...props} />;
});

const TeamList = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch data from API
  useEffect(() => {
    fetchTeams();
  }, [page, pageSize, filter]);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}team/all`);
      const data = response.data;
      setTeams(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    const message = error.response?.data?.message || "An error occurred";
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleAddTeam = () => {
    setSelectedTeam({ name: "", description: "" });
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleUpdate = (team) => {
    setSelectedTeam(team);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (team) => {
    try {
      await axios.delete(`${BASE_URL}team/${team.id}`);
      setSnackMessage(`Team deleted: ${team.name}`);
      fetchTeams();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setSnackMessage("Cannot delete team with active users");
      } else {
        handleApiError(error);
      }
    } finally {
      setSnackOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDialogSave = async () => {
    try {
      if (isEditMode) {
        const updateData = {};
        if (selectedTeam.name) updateData.name = selectedTeam.name;
        if (selectedTeam.description)
          updateData.description = selectedTeam.description;

        const response = await axios.put(
          `${BASE_URL}team/${selectedTeam.id}`,
          updateData
        );

        if (response.data.message) {
          setSnackMessage(`${response.data.message}`);
        } else {
          setSnackMessage(`Team updated: ${selectedTeam.name}`);
        }
      } else {
        const newTeamData = { name: selectedTeam.name };
        if (selectedTeam.description)
          newTeamData.description = selectedTeam.description;

        const response = await axios.post(`${BASE_URL}team/add`, newTeamData);
        if (response.data.message) {
          setSnackMessage(`${response.data.message}`);
        } else {
          setSnackMessage(`Team added: ${selectedTeam.name}`);
        }
      }
      fetchTeams();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSnackOpen(true);
      setDialogOpen(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Team Name",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.name}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.description}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleUpdate(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <Grid container spacing={6}>
      <Snackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        autoHideDuration={3000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      />
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Teams List"
            action={
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddTeam}
              >
                Add Team
              </Button>
            }
          />
          <CardContent>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Filter by Team Name"
                value={filter}
                onChange={handleFilterChange}
              />
            </FormControl>
            <DataGrid
              autoHeight
              pagination
              rows={
                isLoading
                  ? []
                  : teams.filter((team) =>
                      team.name.toLowerCase().includes(filter.toLowerCase())
                    )
              }
              columns={columns}
              loading={isLoading}
              getRowId={(row) => row.id}
              rowCount={teams.length}
              disableSelectionOnClick
              pageSize={pageSize}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              paginationMode="server"
            />
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Edit Team" : "Add Team"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode
              ? "Edit the details of the team below."
              : "Enter the details of the new team below."}
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Team Name"
              value={selectedTeam?.name || ""}
              required
              onChange={(e) =>
                setSelectedTeam({ ...selectedTeam, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Description"
              value={selectedTeam?.description || ""}
              onChange={(e) =>
                setSelectedTeam({
                  ...selectedTeam,
                  description: e.target.value,
                })
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TeamList;
