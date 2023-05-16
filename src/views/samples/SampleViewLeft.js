// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Image from "mdi-material-ui/Image";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { useSelector } from "react-redux";

import moment from "moment";

// ** Styled <sup> component
const Sup = styled("sup")(({ theme }) => ({
  top: "0.2rem",
  left: "-0.6rem",
  position: "absolute",
  color: theme.palette.primary.main,
}));

// ** Styled <sub> component
const Sub = styled("sub")({
  fontWeight: 300,
  fontSize: "1rem",
  alignSelf: "flex-end",
});

const roleColors = {
  admin: "error",
  editor: "info",
  author: "warning",
  maintainer: "success",
  subscriber: "primary",
};

const statusColors = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

const SampleViewLeft = ({ data }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);

  const [jobsSubmitted, setJobsSubmitted] = useState(0);
  const [jobsSubmittedInRadius, setJobsSubmittedInRadius] = useState(0);
  const store = useSelector((state) => state);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);

  useEffect(() => {
    let flagCountSubmitted = store.jobs.data.filter(
      (val) =>
        val.prescriber.id == data.Id && val.Status == "Feedback completed"
    );
    let flagCountSubmittedInRadius = store.jobs.data.filter(
      (val) =>
        val.prescriber.id == data.Id &&
        val.Status == "Feedback completed" &&
        parseFloat(val.difference_location_doctor) < 1 &&
        parseFloat(val.difference_location_doctor) > 0
    );
    setJobsSubmitted(flagCountSubmitted.length);
    setJobsSubmittedInRadius(flagCountSubmittedInRadius.length);
  }, [data.Id, store.jobs.data]);

  const renderUserAvatar = () => {
    return (
      <CustomAvatar
        skin="light"
        src={data?.Pre_Sign}
        variant="rounded"
        color={data.avatarColor}
        sx={{
          width: 120,
          height: 120,
          fontWeight: 600,
          marginBottom: 4,
          fontSize: "3rem",
        }}
      >
        {/* {getInitials(data.name)} */}
      </CustomAvatar>
    );
  };

  if (data) {
    return (
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
                {data?.Id}
              </Typography>
              <CustomChip
                skin="light"
                size="small"
                label="Sample Number"
                color={"success"}
                sx={{
                  height: 20,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  borderRadius: "5px",
                  textTransform: "capitalize",
                  "& .MuiChip-label": { mt: -0.25 },
                }}
              />
            </CardContent>

            {/* <CardContent sx={{ marginTop: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ marginRight: 3 }}>
                    <Check />
                  </CustomAvatar>
                  <Box>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      {jobsSubmitted}
                    </Typography>
                    <Typography variant='body2'>Submitted</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ marginRight: 3 }}>
                    <BriefcaseVariantOutline />
                  </CustomAvatar>
                  <Box>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      {jobsSubmittedInRadius}
                    </Typography>
                    <Typography variant='body2'>Within Radius</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent> */}

            <CardContent>
              <Typography variant="h6">Details</Typography>
              <Divider />
              <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Grid container>
                  <Grid item md={5} xs={12}>
                    <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                      <Typography
                        sx={{
                          marginRight: 2,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        Quantity 20 MG:
                      </Typography>
                      <Typography variant="body2">
                        {data?.Quantity_20}
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
                        Quantity 60 MG:
                      </Typography>
                      <Typography variant="body2">
                        {data?.Quantity_60}
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
                        Status:
                      </Typography>
                      <Typography variant="body2">
                        {String(data?.Status).toUpperCase()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={7} xs={12}>
                    <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                      <Typography
                        sx={{
                          marginRight: 2,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        Request Date:
                      </Typography>
                      <Typography variant="body2">
                        {moment(data?.Pre_Sign_Date).format("YYYY-MM-DD")}
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
                        Deliver Date:
                      </Typography>
                      <Typography variant="body2">
                        {String(data?.Post_Sign_Date) != "null"
                          ? moment(data?.Post_Sign_Date).format("YYYY-MM-DD")
                          : "N.A."}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container justifyContent={"space-between"}>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <img
                      src={
                        data.Pre_Sign
                          ? `data:image/png;base64,${data.Pre_Sign}`
                          : "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                      }
                      style={{
                        width: 120,
                        height: 120,
                        fontWeight: 600,
                        marginBottom: 4,
                        fontSize: "3rem",
                      }}
                    />
                    <b>Pre - Sign Image</b>
                  </Grid>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <a
                      href="#"
                      onClick={() => {
                        if (
                          data.Pre_Sign_Location__Latitude__s &&
                          data.Pre_Sign_Location__Longitude__s
                        ) {
                          window.open(
                            "https://www.google.com/maps?saddr=" +
                              data.Pre_Sign_Location__Latitude__s +
                              "," +
                              data.Pre_Sign_Location__Longitude__s +
                              "&daddr=" +
                              data.Prescriber.Location__Latitude__s +
                              "," +
                              data.Prescriber.Location__Longitude__s
                          );
                        } else {
                          alert("location is not available.");
                        }
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <b>Pre - Sign Location</b>
                    </a>
                  </Grid>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                      <Typography
                        sx={{
                          marginRight: 2,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        <b>Pre - Sign Date:</b>
                      </Typography>
                      <Typography variant="body2">
                        {moment(data?.Pre_Sign_Date).format("YYYY-MM-DD")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <img
                      src={
                        data.Post_Sign
                          ? `data:image/png;base64,${data.Post_Sign}`
                          : "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                      }
                      style={{
                        width: 120,
                        height: 120,
                        fontWeight: 600,
                        marginBottom: 4,
                        fontSize: "3rem",
                      }}
                    />
                    <b>Post - Sign Image</b>
                  </Grid>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <a
                      href="#"
                      onClick={() => {
                        if (
                          data.Post_Sign_Location__Latitude__s &&
                          data.Post_Sign_Location__Longitude__s
                        ) {
                          window.open(
                            "https://www.google.com/maps?saddr=" +
                              data.Post_Sign_Location__Latitude__s +
                              "," +
                              data.Post_Sign_Location__Longitude__s +
                              "&daddr=" +
                              data.Prescriber.Location__Latitude__s +
                              "," +
                              data.Prescriber.Location__Longitude__s
                          );
                          // window.open(`https://www.google.com/maps?saddr=${},${}`, '_blank');
                        } else {
                          alert("location is not available.");
                        }
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <b>Post - Sign Location</b>
                    </a>
                  </Grid>
                  <Grid
                    item
                    sx={5}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                      <Typography
                        sx={{
                          marginRight: 2,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        <b>Post - Sign Date:</b>
                      </Typography>
                      <Typography variant="body2">
                        {moment(data?.Post_Sign_Date).format("YYYY-MM-DD")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default SampleViewLeft;
