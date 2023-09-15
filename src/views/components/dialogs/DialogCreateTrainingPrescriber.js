import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const CreateTrainingPrescriber = ({ open, handleClose }) => {
  const [prescriber, setPrescriber] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    age: null,
    reverse: "",
    reject: "",
    dispense: "",
    speciality: "",
    professionalConcentration: "",
    marketDecile: null,
    experience: "",
    npi: null,
    hospital: "",
  });
  const [value, setValue] = useState("");

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const handleSelect = (address) => {
    setValue(address);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPrescriber((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getLocationData = async (location) => {
    let premise = "";
    let Street_Address = "";
    let City = "";
    let State = "";
    let Zip = "";
    let subpremise = "";
    const { lat, lng } = await getLatLng(location);
    location.address_components.forEach((componenet) => {
      if (
        componenet.types.includes("premise") ||
        componenet.types.includes("street_number")
      ) {
        premise = componenet.long_name;
      }
      if (
        componenet.types.includes("sublocality") ||
        componenet.types.includes("route")
      ) {
        Street_Address =
          Street_Address == ""
            ? componenet.long_name
            : Street_Address + ", " + componenet.long_name;
      }

      if (componenet.types.includes("locality")) {
        City = componenet.long_name;
      }

      if (componenet.types.includes("administrative_area_level_1")) {
        State = componenet.short_name;
      }

      if (componenet.types.includes("postal_code")) {
        Zip = componenet.long_name;
      }

      if (componenet.types.includes("subpremise")) {
        subpremise = componenet.short_name;
      }
    });

    if (Boolean(subpremise)) {
      Street_Address += " " + subpremise;
    }

    return {
      Street_Address: premise + ", " + Street_Address,
      City: City,
      State: State,
      Zip: Zip,
      Location__Latitude: lat,
      Location__Longitude: lng,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await geocodeByAddress(value);
    let d = await getLocationData(result[0]);

    try {
      const response = await fetch(
        `${BASE_URL}prescriber/create_training_prescribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Age: prescriber.age,
            City: d.City,
            Email: prescriber.email,
            Experience: prescriber.experience,
            First_Name: prescriber.firstName,
            Gender: prescriber.gender,
            Hospital: prescriber.hospital,
            Last_Name: prescriber.lastName,
            NPI: prescriber.npi,
            Phone: prescriber.phoneNumber,
            Speciality: prescriber.speciality,
            State: d.State,
            Street_Address: d.Street_Address,
            Zip: d.Zip,
            Location__Latitude: d.Location__Latitude,
            Location__Longitude: d.Location__Longitude,
            Market_Decile: prescriber.marketDecile,
            Professional_Concentration: prescriber.professionalConcentration,
            Reverse: prescriber.reverse,
            Reject: prescriber.reject,
            Dispense: prescriber.dispense,
            clientId: userData.clientId,
          }),
        }
      );
      const data = await response.json();

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
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        {"Create Training Prescriber"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogActions className="dialog-actions-dense">
          <FormControl sx={{ padding: 5, mb: 5 }}>
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.firstName}
                    onChange={handleChange}
                    id="first-name"
                    name="firstName"
                    placeholder="First Name"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.lastName}
                    onChange={handleChange}
                    id="last-name"
                    name="lastName"
                    placeholder="Last Name"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="email"
                    value={prescriber.email}
                    onChange={handleChange}
                    id="email"
                    name="email"
                    placeholder="Email"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="tel"
                    value={prescriber.phoneNumber}
                    onChange={handleChange}
                    id="phone-number"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="number"
                    value={prescriber.age}
                    onChange={handleChange}
                    id="age"
                    name="age"
                    placeholder="Enter Age"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    required
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    placeholder="Enter Gender"
                    value={prescriber.gender}
                    onChange={handleChange}
                    variant="standard"
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="number"
                    value={prescriber.marketDecile}
                    onChange={handleChange}
                    id="marketDecile"
                    name="marketDecile"
                    placeholder="Market Decile"
                    variant="standard"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.speciality}
                    onChange={handleChange}
                    id="speciality"
                    name="speciality"
                    placeholder="Speciality"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.professionalConcentration}
                    onChange={handleChange}
                    id="professional-concentration"
                    name="professionalConcentration"
                    placeholder="Professional Concentration"
                    variant="standard"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="reverse-label">Reverse</InputLabel>
                  <Select
                    required
                    labelId="reverse-label"
                    id="reverse"
                    name="reverse"
                    value={prescriber.reverse}
                    onChange={handleChange}
                    variant="standard"
                  >
                    <MenuItem value="">Select Reverse</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="reject-label">Reject</InputLabel>
                  <Select
                    required
                    labelId="reject-label"
                    id="reject"
                    name="reject"
                    value={prescriber.reject}
                    onChange={handleChange}
                    variant="standard"
                  >
                    <MenuItem value="">Select Reverse</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="dispense-label">Dispense</InputLabel>
                  <Select
                    required
                    labelId="dispense-label"
                    id="dispense"
                    name="dispense"
                    value={prescriber.dispense}
                    onChange={handleChange}
                    variant="standard"
                  >
                    <MenuItem value="">Select Reverse</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.experience}
                    onChange={handleChange}
                    id="experience"
                    name="experience"
                    placeholder="Experience"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="text"
                    value={prescriber.hospital}
                    onChange={handleChange}
                    id="hospital"
                    name="hospital"
                    placeholder="Hospital"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type="number"
                    value={prescriber.npi}
                    onChange={handleChange}
                    id="npi"
                    name="npi"
                    placeholder="NPI"
                    variant="standard"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <PlacesAutocomplete
                  value={value}
                  onChange={(e) => {
                    setValue(e);
                  }}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <Input
                        {...getInputProps({
                          placeholder: "Address",
                          className: "location-search-input",
                        })}
                        fullWidth
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion, index) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              key={`suggestion-${index}`}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <FormControl fullWidth>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mr: 1 }}
                  >
                    Add
                  </Button>
                  <Button onClick={handleClose} sx={{ mt: 1 }}>
                    Close
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTrainingPrescriber;
