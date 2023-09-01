import React, { useEffect, useState, useRef } from "react";

import Dialog from "@mui/material/Dialog";
import { BASE_URL } from "src/configs/config";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { CloseBox } from "mdi-material-ui";
import toast from "react-hot-toast";

const DialogUpdateFlagNumber = ({ open, handleClose, prescriberId }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const updateTelePrescriber = async () => {
    if (isChecked) {
      try {
        const response = await fetch(
          `${BASE_URL}tele-prescribers/delete-tele-prescriber`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prescriberId: prescriberId,
              IsDeleted: isChecked,
            }),
          }
        );
        const data = await response.json();
        if (data.status == 200) {
          toast.success(data.message);
          handleClose();
        }
      } catch (error) {
        console.log("CHECK", error);
      }
    } else {
      try {
        const response = await fetch(
          `${BASE_URL}tele-prescribers/update-tele-prescriber-number`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prescriberId: prescriberId,
              phoneNumber: phoneNumber,
            }),
          }
        );
        const data = await response.json();
        if (data.status == 200) {
          toast.success(data.message);
          handleClose();
        }
      } catch (error) {
        console.log("CHECK", error);
      }
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        disableBackdropClick
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "700px",
            height: "320px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Edit Tele-Prescriber Number
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
        <DialogContent style={{ paddingLeft: "20px" }}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <FormControlLabel
            control={
              <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
            }
            label="Remove Tele-Prescriber"
          />
        </DialogContent>
        <DialogActions
          className="dialog-actions-dense"
          sx={{ padding: 3, mb: 2, justifyContent: "center" }}
        >
          <Button onClick={updateTelePrescriber} variant="outlined">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogUpdateFlagNumber;
