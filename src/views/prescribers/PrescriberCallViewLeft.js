// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Phone from "mdi-material-ui/Phone";
import FaxIcon from "mdi-material-ui/Fax";
import { ringCentralConfig } from "src/configs/config";
import { useRouter } from "next/router";
import { updateDisabledPrescriber } from "src/store/prescribers";
import io from "socket.io-client";
import { BASE_URL } from "src/configs/config";

import { onCallLogFilterChangeHandler } from "src/store/call_logs";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import DialogSendFax from "../components/dialogs/DialogSendFax";
const RC = require("@ringcentral/sdk").SDK;
import { onFaxLogFilterChangeHandler } from "src/store/fax_logs";
import { useDispatch, useSelector } from "react-redux";

const PrescriberCallViewLeft = ({ data }) => {
  const [open, setOpen] = useState(false);
  const store = useSelector((state) => state);

  const { socket } = store.call_logs.filter;

 // const [platform, setPlatform] = useState(null);
  const { platform  } = useSelector((state) => state.fax_logs.filter);
 
  // const [platform, setPlatform] = useState(null);
  // console.log("platform ledt", platform);
  const dispatch = useDispatch();
  // dispatch(
  //   onFaxLogFilterChangeHandler({ filter: "platform", value: platform })
  // );

  // const { RC_SERVER_URL, RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT } =
  //   ringCentralConfig;

  const initializeSocket = () => {
    const newSocket = io.connect(BASE_URL, { transports: ["websocket"] });
    dispatch(updateDisabledPrescriber(data.Id));
    newSocket.emit("enable_prescriber", data.Id);
        window.history.back();
    dispatch(
      onCallLogFilterChangeHandler({
        filter: "socket",
        value: newSocket,
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(typeof RCAdapter == 'undefined'){
      if(!socket){
        initializeSocket()
      }
      else{
      // router.replace('/phonebook')
      dispatch(updateDisabledPrescriber(data.Id));
      socket.emit("enable_prescriber", data.Id);
          window.history.back();
      }
    }
  }, []);


  // useEffect(() => {
  //   var rcsdk = new RC({
  //     server: RC_SERVER_URL,
  //     clientId: RC_CLIENT_ID,
  //     clientSecret: RC_CLIENT_SECRET,
  //   });

  //   var p = rcsdk.platform();

  //   p.login({
  //     jwt: RC_JWT,
  //   });

  //   p.on(p.events.loginSuccess, function (e) {
  //     console.log("User logged in successfully");
  //     setPlatform(p);
  //   });
  // }, []);

  useEffect(() => {
    if (typeof RCAdapter !== 'undefined')RCAdapter.setClosed(false);
    if (typeof RCAdapter !== 'undefined')RCAdapter.setMinimized(true);

    return () => {
      if (typeof RCAdapter !== 'undefined') RCAdapter.setClosed(true);
    };
  }, []);

  const makeCall = (phoneNumber) => {
    if (typeof RCAdapter !== 'undefined')RCAdapter.setMinimized(false);
    document
      .querySelector("#rc-widget-adapter-frame")
      .contentWindow.postMessage(
        {
          type: "rc-adapter-new-call",
          phoneNumber: phoneNumber,
          toCall: true,
        },
        "*"
      );
  };
  const renderUserAvatar = () => {
    if (true) {
      if (false) {
        return (
          <CustomAvatar
            alt="User Image"
            src={data?.avatar}
            variant="rounded"
            sx={{ width: 120, height: 120, marginBottom: 4 }}
          />
        );
      } else {
        return (
          <CustomAvatar
            skin="light"
            variant="rounded"
            color={data.avatarColor}
            sx={{
              width: 120,
              height: 120,
              fontWeight: 600,
              marginBottom: 4,
              fontSize: "2rem",
            }}
          >
            {getInitials(`${data.First_Name} ${data.Last_Name}`)}
          </CustomAvatar>
        );
      }
    } else {
      return null;
    }
  };
  if (data) {
    return (
      <>
        <DialogSendFax
          open={open}
          handleClose={handleClose}
          FaxNumber={data.Fax}
          platform={platform}
        />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{
                  paddingTop: 15,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {renderUserAvatar()}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {`${data?.First_Name} ${data?.Last_Name}`}
                </Typography>
                <CustomChip
                  skin="light"
                  size="small"
                  label={data?.Specialty}
                  color={"success"}
                  sx={{
                    height: 20,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "5px",
                    textTransform: "capitalize",
                    "& .MuiChip-label": { mt: -0.25 },
                  }}
                />
              </CardContent>

              <CardContent sx={{ marginTop: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    {data.Phone}
                  </Typography>
                  <Phone
                    sx={{ cursor: "pointer", color: "green", fontSize: "2rem" }}
                    onClick={() => makeCall(data.Phone)}
                  />
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    {data.Fax}
                  </Typography>
                  <FaxIcon
                    sx={{ cursor: "pointer", color: "green", fontSize: "2rem" }}
                    onClick={() => setOpen(true)}
                  />
                </Box>
              </CardContent>

              <CardContent>
                <Typography variant="h6">Details</Typography>
                <Divider />
                <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      NPI:
                    </Typography>
                    <Typography variant="body2">
                      {data?.NPI }
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Soaanz Prescriber:
                    </Typography>
                    <Typography variant="body2">
                      {data?.isSoaanzPrescriber ? "YES" : "NO"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Furosemide TRX:
                    </Typography>
                    <Typography variant="body2">{data?.F_TRX}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Market Decile:
                    </Typography>
                    <Typography variant="body2">{data?.Decile}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Dispense Status:
                    </Typography>
                    <Typography variant="body2">{data?.DispenseStatus}</Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Address:
                    </Typography>
                    <Typography variant="body2">
                      {`${data?.Street_Address},
                      ${data?.City},
                      ${data?.State},
                      ${data?.Zip}`}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return null;
  }
};

export default PrescriberCallViewLeft;
