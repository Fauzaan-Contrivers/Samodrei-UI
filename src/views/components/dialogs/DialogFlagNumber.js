import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import { BASE_URL } from "src/configs/config";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { CloseBox } from "mdi-material-ui";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const DialogFlagNumber = ({
  open,
  handleClose,
  prescriberId,
  teleMarketerId,
}) => {
  const [disposition, setDisposition] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const router = useRouter();

  const updateFlagNumber = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}tele-prescribers/update_tele_prescriber_flag_number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriberId: prescriberId,
            teleMarketerId: teleMarketerId,
            disposition: disposition,
            feedbackText: feedbackText,
            flagged: true,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        toast.success(data.message, {
          duration: 2000,
        });
       // window.history.back();
        router.replace("/phonebook");
      }
      else{
        toast.success("Something went wrong try again.", {
          duration: 2000,
        });      }
    } catch (error) {
      toast.success("Something went wrong try again.", {
        duration: 2000,
      });
      console.log("CHECK", error);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        disableBackdropClick
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            width: "500px",
            height: "300px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseBox />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
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
                  Call Answered but goes Direct to Voicemail (recorded VM
                  option)
                </MenuItem>
                <MenuItem value="Call Answered with Do Not call/not interested in SOAANZ request">
                  Call Answered with Do Not call/not interested in SOAANZ
                  request
                </MenuItem>
                <MenuItem value="Call Answered with a Call Back Request (Call Scheduling Option)">
                  Call Answered with a Call Back Request (Call Scheduling
                  Option)
                </MenuItem>
                <MenuItem value="Call Answered and Directed to a Prescriber's Voicemail (recorded VM option)">
                  Call Answered and Directed to a Prescriber's Voicemail
                  (recorded VM option)
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
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions
          className="dialog-actions-dense"
          sx={{ padding: 3, mb: 2, justifyContent: "center" }}
        >
          <Button onClick={updateFlagNumber} variant="outlined">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogFlagNumber;
