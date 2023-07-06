import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";
import { getPrescribersName } from "src/store/prescribers";
import { debounce } from "lodash";
import InputLabel from "@mui/material/InputLabel";

const CreateListDialog = ({ open, handleClose, fields }) => {
  const [state, setState] = useState({
    name: "",
    prescriber: [],
    state: "",
  });
  const [prescriberName, setPrescribersName] = useState([]);
  const [prescriberStates, setPrescribersStates] = useState([]);
  const [prescriberCities, setPrescribersCities] = useState([]);
  const [prescriberSpeciality, setPrescribersSpeciality] = useState([]);
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const fetchData = useCallback(
    debounce(() => {
      dispatch(
        getPrescribersName({
          clientId: userData.clientId,
          name: state.state,
        })
      ).catch((err) => {});
    }, 2000),
    [dispatch, getPrescribersName, state.state, userData.clientId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPrescribersName(store.prescribers.names);
    setPrescribersStates(store.prescribers.state);
    setPrescribersCities(store.prescribers.cities);
    setPrescribersSpeciality(store.prescribers.speciality);
  }, [store.prescribers.names]);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSearchState = (event) => {
    const searchText = event.target.value;
    setState((prevState) => ({
      ...prevState,
      state: searchText,
    }));
  };

  const handleMultiState = (value, key) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}prescriber/create_prescribers_list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: state.name,
            prescriber: state.prescriber,
            createdBy: selectedOption,
            city: selectedCity,
            state: selectedState,
            speciality: selectedSpecialty,
          }),
        }
      );
      const data = await response.json();
      console.log("DATA", data);
      if (data.status == 201) {
        toast.success(data.message, {
          duration: 2000,
        });
      }

      if (data.status == 500) {
        toast.error(data.message, {
          duration: 2000,
        });
      }
      handleClose();
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  console.log(selectedCity, selectedState, selectedSpecialty);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          width: "fit-content",
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{fields}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogActions className="dialog-actions-dense">
          <FormControl sx={{ width: 550, padding: 5, mb: 1 }}>
            <FormControl fullWidth>
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
                sx={{ marginBottom: 5 }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="prescriber-select-label">Create List</InputLabel>
              <Select
                labelId="prescriber-select-label"
                id="prescriber-select"
                value={selectedOption}
                onChange={handleOptionChange}
                variant="standard"
                sx={{ marginBottom: 5 }}
              >
                <MenuItem value={true}>By Name</MenuItem>
                <MenuItem value={false}>By Filter</MenuItem>
              </Select>
            </FormControl>
            {selectedOption ? (
              <FormControl fullWidth>
                <Autocomplete
                  required
                  multiple
                  id="tags-standard"
                  onChange={(e, values) =>
                    handleMultiState(values, "prescriber")
                  }
                  options={prescriberName}
                  getOptionLabel={(option) => option.Name}
                  clearIcon={null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleSearchState}
                      label="Prescriber's List"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
              </FormControl>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    required
                    labelId="prescriber-select-label"
                    id="prescriber-select"
                    value={selectedState}
                    onChange={handleStateChange}
                    variant="standard"
                    sx={{ marginBottom: 3 }}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {prescriberStates.map((state, index) => (
                      <MenuItem key={index} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    required
                    value={selectedCity}
                    onChange={handleCityChange}
                    variant="standard"
                    sx={{ marginBottom: 3 }}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {prescriberCities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    fullWidth
                    required
                    value={selectedSpecialty}
                    variant="standard"
                    onChange={handleSpecialtyChange}
                  >
                    <MenuItem value="">Select Speciality</MenuItem>
                    {prescriberSpeciality.map((speciality, index) => (
                      <MenuItem key={index} value={speciality}>
                        {speciality}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <FormControl sx={{ width: 500, padding: 5, mb: 1 }}>
              <Button type="submit" variant="contained" sx={{ mt: 1, mb: 1 }}>
                Add
              </Button>
              <Button onClick={handleClose} sx={{ mt: 1, mb: 1 }}>
                Close
              </Button>
            </FormControl>
          </FormControl>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateListDialog;
