// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports

import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/router";

import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";
import authConfig from "src/configs/auth";

import { useDispatch, useSelector } from "react-redux";
import { updateDisabledPrescriber } from "src/store/prescribers";
import DialogSetMeeting from "../components/dialogs/DialogSetMeeting";
import DialogFlagNumber from "../components/dialogs/DialogFlagNumber";

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
  const [phoneNumberFeedbackArray, setPhoneNumberFeedbackArray] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPosition, setReceiverPosition] = useState("");
  const [disposition, setDisposition] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCalled, setIsCalled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [commentData, setCommentData] = useState(false);
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state);
  const meetingDate = useSelector(
    (state) => state.prescribers.TelePrescriberData.result[0].MeetingDate
  );
  // console.log("meeting date", meetingDate)
  const { socket } = store.call_logs.filter;

  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );
//  console.log("phoneNumberFeedbackArray", phoneNumberFeedbackArray);
  useEffect(() => {
    if (prescriber.CallFeedback) {
      setPhoneNumberFeedbackArray(prescriber.CallFeedback.split(", "));
    }
  }, []);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        const isUpdated = updateTelePrescriberCallStatus(prescriber.Id, false);
        if (isUpdated) {
          dispatch(updateDisabledPrescriber(prescriber.Id));
          socket.emit("enable_prescriber", prescriber.Id);
        }
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router, socket]);

  useEffect(() => {
    if (
      disposition ==
      "Call Answered with a Call Back Request (Call Scheduling Option)"
    ) {
      setOpen(true);
    } else {
      if (disposition !== "") {
        updateTelePrescriberMeetDate();
      }
    }
  }, [disposition]);

 useEffect(() => {
   getFeedback();
 }, []);

 const getFeedback = async () => {
   try {
     const response = await fetch(
       `${BASE_URL}tele-prescribers/get_call_logs_feedback?prescriberId=${prescriber.Id}`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

  if (response.ok) {
    const data = await response.json();
    setCommentData(data)
  } else {
    console.error("Request failed with status:", response.status);
  }   } catch (error) {
     console.log("CHECK", error);
   }
 };

  const updateTelePrescriberMeetDate = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update_tele_prescriber_meeting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriberId: prescriber.Id,
            flagged: false,
            meetingDate: null,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        console.log("CHECK", data);
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  const onSubmitFeedbackHandler = async () => {
    if (isCalled) {
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
          const isUpdated = updateTelePrescriberCallStatus(
            prescriber.Id,
            false
          );
          if (isUpdated) {
            toast.success(data.message, {
              duration: 2000,
            });
            router.replace("/phonebook");
          }
        }
        else{
          toast.error("Something went wrong, please try again!", {
            duration: 2000,
          });
        }
      } catch (error) {
        console.log("CHECK", error);
        toast.error("Something went wrong, please try again!", {
          duration: 2000,
        });
      }
    } else {
      onCloseClickHandler();
    }
  };

  const onCloseClickHandler = () => {
    const isUpdated = updateTelePrescriberCallStatus(prescriber.Id, false);
    if (isUpdated) {
      dispatch(updateDisabledPrescriber(prescriber.Id));
      socket.emit("enable_prescriber", prescriber.Id);
          window.history.back();
      // router.replace("/phonebook");
    }
  };

  const updateTelePrescriberCallStatus = async (prescriberId, flag) => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update_tele_prescriber_call_status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriberId: prescriberId,
            flagged: flag,
          }),
        }
      );
      const data = await response.json();
      console.log("DATA", data);
      if (data.status == 200) {
        return true;
      } else {
        return false;
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
          setIsCalled(true);
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

  const handleCloseDialog = () => {
    setOpen(false);
    dispatch(updateDisabledPrescriber(prescriber.Id));
    // socket.emit("enable_prescriber", prescriber.Id);
    // router.replace("/phonebook");
  };

  const handleCloseFlagDialog = () => {
    setOpenFlagDialog(false);
  };

  return (
    <>
      <DialogSetMeeting
        open={open}
        handleClose={handleCloseDialog}
        prescriberId={prescriber.Id}
      />
      <DialogFlagNumber
        open={openFlagDialog}
        handleClose={handleCloseFlagDialog}
        prescriberId={prescriber.Id}
        teleMarketerId={userData.id}
      />
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
            <InputLabel id="disposition-label">Call Disposition</InputLabel>
            <Select
              labelId="disposition-label"
              id="disposition"
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              label="Disposition"
            >
              <MenuItem value="">Select Disposition</MenuItem>
              <MenuItem value="Wrong Number/not-in-Service">
                Wrong Number/not-in-Service
              </MenuItem>
              <MenuItem value="No Answer/phone Keeping Ringing for more 5 minutes">
                No Answer/phone Keeping Ringing for more 5 minutes
              </MenuItem>
              <MenuItem value="Call Answered but goes Direct to Voicemail (recorded VM option)">
                Call Answered but goes Direct to Voicemail (recorded VM option)
              </MenuItem>
              <MenuItem value="Call Answered with Do Not call/not interested in SOAANZ request">
                Call Answered with Do Not call/not interested in SOAANZ request
              </MenuItem>
              <MenuItem value="Call Answered with a Call Back Request (Call Scheduling Option)">
                Call Answered with a Call Back Request (Call Scheduling Option)
              </MenuItem>
              <MenuItem value="Call Answered and Directed to a Prescriber's Voicemail (recorded VM option)">
                Call Answered and Directed to a Prescriber's Voicemail (recorded
                VM option)
              </MenuItem>
              <MenuItem value="Call Answered and Detailed the listener about SOAANZ">
                Call Answered and Detailed the listener about SOAANZ
              </MenuItem>
              <MenuItem value="Call Answered and Samples Requested">
                Call Answered and Samples Requested
              </MenuItem>
              <MenuItem value="Call Answered and Fax Information Requested">
                Call Answered and Fax Information Requested
              </MenuItem>
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
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <Button
              variant="contained"
              onClick={() => onSubmitFeedbackHandler()}
              sx={{ backgroundColor: "green" }}
              // disabled={elapsedTime == 0 ? true : false}
            >
              Submit
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <Button
              variant="contained"
              onClick={() => setOpenFlagDialog(true)}
              disabled={elapsedTime == 0 ? true : false}
            >
              Flag Number
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <Button
              variant="contained"
              onClick={() => onCloseClickHandler()}
              sx={{ backgroundColor: "red" }}
            >
              Close
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant="h6">Comments</Typography>
      <Divider />
      <Grid>
        {/* {phoneNumberFeedbackArray.map((phoneNumber, index) => ( */}
        {/*<Grid marginLeft="10px" item key={index}>
             <h6>{phoneNumber}</h6> 
           </Grid>
         ))}*/}
        {meetingDate &&
          commentData &&
          commentData?.message.map((data) => (
            <Grid paddingLeft="10px" border="1px solid gray">
              <p>{data.CallFeedback}</p>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default PrescriberCallViewRight;
