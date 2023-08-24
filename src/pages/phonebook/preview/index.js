// ** React Imports
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material/Button";
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { fetchTelePrescriberData } from "src/store/prescribers";
// ** Third Party Components
import axios from "axios";

import PrescriberCallViewLeft from "src/views/prescribers/PrescriberCallViewLeft";
import PrescriberCallViewRight from "src/views/prescribers/prescriberCallViewRight";

const Preview = ({ id, invoiceData }) => {
  const store = useSelector((state) => state);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const ability = useContext(AbilityContext);

  const fetchData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(fetchTelePrescriberData({ id: id }));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("USe effect Id", id);
    fetchData(id);
  }, [id]);

  useEffect(() => {
    setData(store.prescribers.TelePrescriberData);
  }, [store.prescribers.TelePrescriberData]);

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
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5} lg={4}>
            <PrescriberCallViewLeft data={data?.result[0]} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <PrescriberCallViewRight prescriber={data?.result[0]} />
          </Grid>
        </Grid>
      </>
    );
  } else {
    return <div>No data available.</div>;
  }
};
export default Preview;
