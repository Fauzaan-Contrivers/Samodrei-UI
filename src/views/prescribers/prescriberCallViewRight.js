// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/router";

import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";
import authConfig from "src/configs/auth";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(3),
  },
}));

const PrescriberCallViewRight = ({ prescriber }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumberFeedbackArray, setPhoneNumberFeedbackArray] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPosition, setReceiverPosition] = useState("");
  const [disposition, setDisposition] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const router = useRouter();

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  useEffect(() => {
    if (prescriber.CallFeedback) {
      setPhoneNumberFeedbackArray(prescriber.CallFeedback.split(", "));
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onSubmitFeedbackHandler = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/add_call_logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telemarketerId: userData.id,
            prescriberId: prescriber.Id,
            flagged: isChecked,
            feedback: feedbackText,
            call_time: elapsedTime,
            call_receiver_name: receiverName,
            call_receiver_position: receiverPosition,
            call_disposition: disposition,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        setPhoneNumberFeedbackArray((prevArray) => [
          ...prevArray,
          feedbackText,
        ]);

        toast.success(data.message, {
          duration: 2000,
        });
        router.replace("/phonebook");
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  const startTimer = () => {
    setStartTime(Date.now());
  };

  const endTimer = () => {
    const currentTime = Date.now();
    const totalElapsedTimeInSeconds = Math.floor(
      (currentTime - startTime) / 1000
    );
    setElapsedTime(totalElapsedTimeInSeconds);
  };

  window.addEventListener("message", (e) => {
    const data = e.data;
    if (data) {
      switch (data.type) {
        case "rc-call-init-notify":
          // get call when user creates a call from dial
          startTimer();
          break;
        case "rc-call-end-notify":
          // get call on call end event
          endTimer();
          break;
        default:
          break;
      }
    }
  });

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h6">Feedback Form</Typography>
        </div>
        <div>
          <Typography>Call Time: {formatElapsedTime(elapsedTime)}</Typography>
        </div>
      </div>

      <Divider />
      <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
        <Grid item xs={12}>
          <TextField
            id="receiver-name"
            label="Receiver Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="receiver-position-label">
              Receiver Position
            </InputLabel>
            <Select
              labelId="receiver-position-label"
              id="receiver-position"
              value={receiverPosition}
              onChange={(e) => setReceiverPosition(e.target.value)}
              label="Receiver Position"
            >
              <MenuItem value="">Select Receiver Position</MenuItem>
              <MenuItem value="Front Desk">Front Desk</MenuItem>
              <MenuItem value="Operator">Operator</MenuItem>
              <MenuItem value="Nurse">Nurse</MenuItem>
              <MenuItem value="Nurse Practitioner">Nurse Practitioner</MenuItem>
              <MenuItem value="Medical Assistant">Medical Assistant</MenuItem>
              <MenuItem value="Physician Assistant">
                Physician Assistant
              </MenuItem>
              <MenuItem value="Physician">Physician</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel id="disposition-label">Disposition</InputLabel>
            <Select
              labelId="disposition-label"
              id="disposition"
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              label="Disposition"
            >
              <MenuItem value="">Select Disposition</MenuItem>
              <MenuItem value="Interested 1">Interested 1</MenuItem>
              <MenuItem value="Interested 2">Interested 2</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
              <MenuItem value="No Answer">No Answer</MenuItem>
              <MenuItem value="Callback">Callback</MenuItem>
              <MenuItem value="Not in Service">Not in Service</MenuItem>
              <MenuItem value="Not Available">Not available</MenuItem>
              <MenuItem value="Number Busy">Number Busy</MenuItem>
              <MenuItem value="Voicemail 1">Voicemail 1</MenuItem>
              <MenuItem value="Voicemail 2">Voicemail 2</MenuItem>
              <MenuItem value="Voicemail 3">Voicemail 3</MenuItem>
              <MenuItem value="Hung up 1">Hung up 1</MenuItem>
              <MenuItem value="Hung up 2">Hung up 2</MenuItem>
              <MenuItem value="Hung up 3">Hung up 3</MenuItem>
              <MenuItem value="Wrong Number">Wrong Number</MenuItem>
              <MenuItem value="Do not Call">Do not Call</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="feedback-text"
            label="Feedback"
            variant="outlined"
            multiline
            fullWidth
            margin="dense"
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </Grid>
        <Grid xs={6}>
          <FormControlLabel
            control={
              <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
            }
            label="Flag Number"
            sx={{ margin: "5px" }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        marginBottom="15px"
      >
        <Button
          variant="contained"
          onClick={() => onSubmitFeedbackHandler()}
          sx={{ marginLeft: 2 }}
        >
          Submit
        </Button>
      </Grid>
      <Typography variant="h6">Comments</Typography>
      <Divider />
      <Grid border="1px solid gray">
        {phoneNumberFeedbackArray.map((phoneNumber, index) => (
          <Grid marginLeft="10px" item key={index}>
            <h6>{phoneNumber}</h6>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PrescriberCallViewRight;
