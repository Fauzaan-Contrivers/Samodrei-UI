import React, { useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import { BASE_URL, FAX_URL } from "src/configs/config";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { CloseBox } from "mdi-material-ui";
import authConfig from "src/configs/auth"
var FormData = require("form-data");
import toast from "react-hot-toast";

const DialogSendFax = ({ open, handleClose, FaxNumber, platform }) => {
  const defaultFaxNumber = FaxNumber == 0 ? "" : FaxNumber;
  const [faxNumber, setFaxNumber] = useState(defaultFaxNumber);
  const [message, setMessage] = useState("");
  const [imgBlob, setBlob] = useState(null);

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  useEffect(() => {
    // fetch("http://localhost:3000/files/fax.jpg")
    fetch(`${FAX_URL}files/faxImage.jpg`)
      .then((response) => response.blob())
      .then((blob) => {
        setBlob(blob);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  }, []);

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

      const file = new File([imgBlob], "faxNew.jpg", { type: "image/jpeg" });

      formData.append("attachment", file);

      let endpoint = "/restapi/v1.0/account/~/extension/~/fax";
      var resp = await platform
        .post(endpoint, formData)
        .then(handleClose())
        .then(async function (resp) {
          var jsonObj = await resp.json();
          // console.log("DATA: ", jsonObj);
          // console.log("FAX sent. Message id: " + jsonObj.id);
          send_fax_number_data(jsonObj.id, faxNumber, jsonObj.messageStatus);

          toast.success("Success", {
            duration: 5000,
          });
          check_fax_message_status(jsonObj.id);
        });
    } catch (e) {
      toast.error("Error", {
        duration: 5000,
      });
      console.log(e.message);
    }
  };
  async function send_fax_number_data(id, faxNumber, messageStatus) {
    try {
      console.log("CALLED");
      const response = await fetch(`${BASE_URL}call-logs/create-fax-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faxId: id,
          faxNumber: faxNumber,
          status: messageStatus,
          TeleMarketerId: userData.id,
        }),
      });
      const data = await response.json();
      if (data.status == 200) {
        console.log("Table Updated", data);
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  }

  async function update_fax_number_data(id, messageStatus) {
    try {
      console.log("CALLED");
      const response = await fetch(`${BASE_URL}call-logs/update-fax-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faxId: id,
          status: messageStatus,
        }),
      });
      const data = await response.json();
      if (data.status == 200) {
        console.log("Table Updated", data);
      }
    } catch (error) {
      console.log("CHECK", error);
    }
  }
  async function check_fax_message_status(messageId) {
    try {
      let endpoint = `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`;
      let resp = await platform.get(endpoint);
      let jsonObj = await resp.json();
      console.log("Message status: ", jsonObj.messageStatus);
      if (jsonObj.messageStatus == "Queued") {
        await sleep(10000);
        update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        check_fax_message_status(jsonObj.id);
      } else if (jsonObj.messageStatus == "Sent") {
        update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        toast.success(jsonObj.messageStatus, {
          duration: 5000,
        });
      } else {
        update_fax_number_data(jsonObj.id, jsonObj.messageStatus);
        toast.error(jsonObj.messageStatus, {
          duration: 5000,
        });
      }
    } catch (e) {
      update_fax_number_data(jsonObj.id, faxNumber, jsonObj.messageStatus);
      toast.error("Error", {
        duration: 5000,
      });
      console.log(e);
    }
  }

  const sleep = async (ms) => {
    await new Promise((r) => setTimeout(r, ms));
  };

  const handleFaxNumberChange = (e) => {
    setFaxNumber(e.target.value);
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //   }
  // };

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
            height: "320px",
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
            {/* <Grid item xs={12} sx={{ marginBottom: "10px" }}>
              <TextField
                type="file"
                id="file"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                fullWidth
              />
            </Grid> */}
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