// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContentText from "@mui/material/DialogContentText";

// ** Icons Imports
import Check from "mdi-material-ui/Check";
import Circle from "mdi-material-ui/Circle";
import BriefcaseVariantOutline from "mdi-material-ui/BriefcaseVariantOutline";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import { useSelector } from "react-redux";
import { isJson } from "src/configs/utils";

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

const UserViewLeft = ({ data, jobsData, samplesData }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);

  const [jobsSubmitted, setJobsSubmitted] = useState(0);
  const [jobsSubmittedInRadius, setJobsSubmittedInRadius] = useState(0);

  const [sample20Mg, setSample20Mg] = useState({
    total: 0,
    distributed: 0,
    left: 0,
  });

  const [sample60Mg, setSample60Mg] = useState({
    total: 0,
    distributed: 0,
    left: 0,
  });

  const [lunches, setLunches] = useState(0);

  const store = useSelector((state) => state);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);

  useEffect(() => {
    let flagCountSubmitted = jobsData.filter(
      (val) =>
        val.Product_Advocate_Id == data.Id && val.Status == "Feedback completed"
    );
    let flagCountSubmittedInRadius = jobsData.filter(
      (val) =>
        val.Product_Advocate_Id == data.Id &&
        val.Status == "Feedback completed" &&
        parseFloat(val.difference_location_doctor) < 1 &&
        parseFloat(val.difference_location_doctor) > 0
    );
    setJobsSubmitted(flagCountSubmitted.length);
    setJobsSubmittedInRadius(flagCountSubmittedInRadius.length);
    setSample20Mg(fetch20mgSampleDetail(data));
    setSample60Mg(fetch60mgSampleDetail(data));
  }, [data.Id, store.jobs.data]);

  useEffect(() => {
    if (data.Id) {
      const temp = jobsData.filter(
        (val) => val.Product_Advocate_Id == data.Id && Boolean(val.question_1)
      );
      setLunches(temp.length);
    }
  }, [data.Id, store.jobs.data]);

  const fetch20mgSampleDetail = (data) => {
    const total = !Boolean(data?.Stock_20) ? 0 : parseInt(data.Stock_20);
    var distributed = 0;
    samplesData.map((sample) => {
      distributed += sample?.sample_Quantity_20;
    });
    // var data_ = store.samples.data.filter(d => d.Product_Advocate.SalesforceId == data?.SalesforceId && d.Status == 'delivered')
    // data_.forEach(t => (distributed += !Boolean(t.Quantity_20) ? 0 : parseInt(t.Quantity_20)))
    const left = total - distributed;
    return {
      total: total,
      distributed: distributed,
      left: left,
    };
  };

  const fetch60mgSampleDetail = (data) => {
    const total = !Boolean(data?.Stock_60) ? 0 : parseInt(data.Stock_60);
    var distributed = 0;
    samplesData.map((sample) => {
      distributed += sample?.sample_Quantity_60;
    });
    // var data_ = store.samples.data.filter(d => d.Product_Advocate.SalesforceId == data?.SalesforceId && d.Status == 'delivered')
    // data_.forEach(t => (distributed += !Boolean(t.Quantity_60) ? 0 : parseInt(t.Quantity_60)))
    const left = total - distributed;
    return {
      total: total,
      distributed: distributed,
      left: left,
    };
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
              fontSize: "3rem",
            }}
          >
            {getInitials(data.Name)}
          </CustomAvatar>
        );
      }
    } else {
      return null;
    }
  };
  if (data) {
    const checkJson = isJson(data.Location);

    if (checkJson) {
      const location = JSON.parse(data?.Location);
      var address = "";
      location?.street ? (address += location.street) : "";
      location?.city ? (address += ", " + location.city) : "";
      location?.state ? (address += ", " + location.state) : "";
      location?.zipcode ? (address += ", " + location.zipcode) : "";
    } else {
      var address = data?.Location;
    }

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
              {/* {renderUserAvatar()} */}
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {data?.Name}
              </Typography>
              <CustomChip
                skin="light"
                size="small"
                label="Product Advocate"
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

            <CardContent sx={{ marginTop: 2 }}>
              <Grid
                container
                spacing={3}
                sx={{ mt: 0.1 }}
                justifyContent={"space-around"}
              >
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {jobsSubmitted}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Submit
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {jobsSubmittedInRadius}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    In-Radius
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {lunches}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Lunch
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>

            <CardContent sx={{ marginTop: 3 }}>
              <CustomChip
                skin="light"
                size="small"
                label="SOAANZ 20 MG"
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
              <Grid
                container
                spacing={3}
                sx={{ mt: 0.1 }}
                justifyContent={"space-between"}
              >
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample20Mg.total}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Total
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample20Mg.distributed}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Distributed
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample20Mg.left}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Left
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>

            <CardContent sx={{ marginTop: 3 }}>
              <CustomChip
                skin="light"
                size="small"
                label="SOAANZ 60 MG"
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
              <Grid
                container
                spacing={3}
                sx={{ mt: 0.1 }}
                justifyContent={"space-between"}
              >
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample60Mg.total}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Total
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample60Mg.distributed}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Distributed
                  </Typography>
                </Grid>
                <Grid item sx={4} style={{ display: "flex" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ marginRight: 3 }}
                  >
                    {sample60Mg.left}
                  </CustomAvatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ lineHeight: 1.3, margin: "auto" }}
                  >
                    Left
                  </Typography>
                </Grid>
              </Grid>
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
                    Email:
                  </Typography>
                  <Typography variant="body2">{data?.Email}</Typography>
                </Box>
                <Box sx={{ display: "flex", marginBottom: 2.7 }}>
                  <Typography
                    sx={{
                      marginRight: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Phone:
                  </Typography>
                  <Typography variant="body2">{data?.Phone}</Typography>
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
                  <Typography variant="body2">{address}</Typography>
                </Box>
              </Box>
            </CardContent>

            {/* <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ marginRight: 3 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined'>
                Suspend
              </Button>
            </CardActions> */}
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;
