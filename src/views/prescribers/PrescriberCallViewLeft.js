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

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import DialogSendFax from "../components/dialogs/DialogSendFax";
import { ringCentralConfig } from "src/configs/config";
const RC = require("@ringcentral/sdk").SDK;

const PrescriberCallViewLeft = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState(null);

  const { RC_SERVER_URL, RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT } =
    ringCentralConfig;

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    var rcsdk = new RC({
      server: RC_SERVER_URL,
      clientId: RC_CLIENT_ID,
      clientSecret: RC_CLIENT_SECRET,
    });

    var p = rcsdk.platform();

    p.login({
      jwt: RC_JWT,
    });

    p.on(p.events.loginSuccess, function (e) {
      console.log("User logged in successfully");
      setPlatform(p);
    });
  }, []);

  useEffect(() => {
    RCAdapter.setClosed(false);
    RCAdapter.setMinimized(true);

    return () => {
      RCAdapter.setClosed(true);
    };
  }, []);

  const makeCall = (phoneNumber) => {
    RCAdapter.setMinimized(false);
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
