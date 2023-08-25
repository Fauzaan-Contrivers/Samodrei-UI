import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import axios from "axios";
import UserViewLeft from "src/views/product_advocates/UserViewLeft";
import UserViewRight from "src/views/product_advocates/UserViewRight";
import { fetchProductAdvocateData } from "src/store/product_advocates";
import { BASE_URL } from "src/configs/config";
import ResetPasswordForm from "../form";

const Preview = ({ email }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (email) => {
    setLoading(true);
    setError(null);
    if (email) {
      try {
        const response = await fetch(`${BASE_URL}user/get-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        });
        const data = await response.json();

        if (data.statusCode == 200) {
          setData(data);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchData(email);
  }, [email]);

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" color="primary" onClick={fetchData}>
            Retry
          </Button>
        </Grid>
      </Grid>
    );
  } else if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="info">Loading....</Alert>
        </Grid>
      </Grid>
    );
  } else if (data) {
    return <ResetPasswordForm email={email} />;
  } else {
    return <div>No data available.</div>;
  }
};

export default Preview;
