import React, { useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import { BASE_URL } from "src/configs/config";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { CloseBox } from "mdi-material-ui";
var FormData = require("form-data");
import toast from "react-hot-toast";

const DialogSendFax = ({ open, handleClose, FaxNumber, platform }) => {
  const defaultFaxNumber = FaxNumber == 0 ? "" : FaxNumber;
  const [faxNumber, setFaxNumber] = useState(defaultFaxNumber);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      var formData = null;

      formData = new FormData();

      var bodyParams = {
        to: [{ phoneNumber: faxNumber }],
        faxResolution: "High",
        coverPageText: message,
      };

      const jsonBlob = new Blob([JSON.stringify(bodyParams)], {
        type: "application/json",
      });

      formData.append("json", jsonBlob, "request.json");

      formData.append("attachment", file);

      let endpoint = "/restapi/v1.0/account/~/extension/~/fax";
      var resp = await platform
        .post(endpoint, formData)
        .then(async function (resp) {
          var jsonObj = await resp.json();
          handleClose();
          // console.log("DATA: ", jsonObj);
          // console.log("FAX sent. Message id: " + jsonObj.id);
          toast.success(jsonObj.messageStatus, {
            duration: 2000,
          });
          check_fax_message_status(jsonObj.id);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  async function check_fax_message_status(messageId) {
    try {
      let endpoint = `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`;
      let resp = await platform.get(endpoint);
      let jsonObj = await resp.json();
      // console.log("Message status: ", jsonObj.messageStatus);
      if (jsonObj.messageStatus == "Queued") {
        await sleep(10000);
        check_fax_message_status(jsonObj.id);
      } else if (jsonObj.messageStatus == "Sent") {
        toast.success(jsonObj.messageStatus, {
          duration: 2000,
        });
      } else {
        toast.success(jsonObj.messageStatus, {
          duration: 2000,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  const sleep = async (ms) => {
    await new Promise((r) => setTimeout(r, ms));
  };

  const handleFaxNumberChange = (e) => {
    setFaxNumber(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
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
            height: "400px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          SEND FAX
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
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginBottom: "10px", marginTop: "15px" }}>
              <TextField
                type="text"
                id="faxNumber"
                label="Fax Number"
                value={faxNumber}
                onChange={handleFaxNumberChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: "10px" }}>
              <TextField
                type="file"
                id="file"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: "10px" }}>
              <TextField
                type="text"
                id="message"
                label="Message (optional)"
                value={message}
                fullWidth
                onChange={handleMessageChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          className="dialog-actions-dense"
          sx={{ padding: 3, mb: 2, justifyContent: "center" }}
        >
          <Button variant="outlined" onClick={() => handleSend()}>
            SEND
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogSendFax;
