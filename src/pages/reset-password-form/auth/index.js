import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { BASE_URL } from "src/configs/config";
import ResetPasswordForm from "../form";
import Error404 from "src/pages/404";

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

        if (data) {
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
    if (data.statusCode == 200) {
      return <ResetPasswordForm email={email} />;
    } else {
      return <Error404 />;
    }
  } else {
    return <div>No data available.</div>;
  }
};

export default Preview;
