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

const PrescriberViewRight = ({ prescriber }) => {
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
        setCommentData(data);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
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
      } catch (error) {
        console.log("CHECK", error);
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

export default PrescriberViewRight;
