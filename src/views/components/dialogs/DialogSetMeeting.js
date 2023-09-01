import React, { useEffect, useState, useRef } from "react";

import Dialog from "@mui/material/Dialog";
import { BASE_URL } from "src/configs/config";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";

const DialogSetMeeting = ({ open, handleClose, prescriberId }) => {
  const [timedate, setTimeDate] = useState(new Date());
  const router = useRouter();

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
            prescriberId: prescriberId,
            flagged: false,
            meetingDate: timedate,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        handleClose();
      }
    } catch (error) {
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
            minWidth: "fit-content",
          },
        }}
      >
        <DialogContent>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select Date And Time"
                value={timedate}
                onChange={(newValue) => setTimeDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </DialogContent>
        <DialogActions
          className="dialog-actions-dense"
          sx={{ padding: 3, mb: 2, justifyContent: "center" }}
        >
          <Button onClick={updateTelePrescriberMeetDate} variant="outlined">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogSetMeeting;
