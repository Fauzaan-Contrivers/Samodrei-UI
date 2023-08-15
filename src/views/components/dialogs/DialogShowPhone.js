import React, { useEffect, useState, useRef } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import UserViewLeft from "src/views/prescribers/UserViewLeft";
import UserViewRight from "src/views/prescribers/UserViewRight";
import PrescriberCallViewLeft from "src/views/prescribers/PrescriberCallViewLeft";
import PrescriberCallViewRight from "src/views/prescribers/prescriberCallViewRight";

const DialogShowPhone = ({ open, handleClose, prescriber }) => {
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
          <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
              <PrescriberCallViewLeft data={prescriber} close={handleClose} />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <PrescriberCallViewRight prescriber={prescriber} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          className="dialog-actions-dense"
          sx={{ padding: 3, mb: 2, justifyContent: "center" }}
        >
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogShowPhone;
