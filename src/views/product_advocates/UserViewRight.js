// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";

// ** Icons Imports

import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Demo Components Imports

import { useSelector } from "react-redux";
import { jobsListViewColumns } from "src/configs/constants";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(3),
  },
}));

const UserViewRight = ({ data }) => {
  // ** State
  const [value, setValue] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const store = useSelector((state) => state);
  const [pageSize, setPageSize] = useState(10);

  const myCols = jobsListViewColumns.filter(function (obj) {
    return obj.field !== "product_advocate";
  });

  useState(() => {
    setJobs(data.jobs);
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const newData = data?.result.map(({ Name, Email, Job_Id }) => ({
    ProductAdvocateName: Name,
    ProductAdvocateEmail: Email,
    ProductAdvocateId: Job_Id,
  }));
  const jobArray = jobs.map((obj) => ({ ...obj, product_advocate: newData }));

  return (
    <TabContext value={value}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value="jobs" label="Recent Jobs" icon={<AccountOutline />} />
      </TabList>
      <Box sx={{ marginTop: 6 }}>
        <TabPanel value="jobs">
          <Card>
            <DataGrid
              getRowId={(data) => data.Job_Id}
              autoHeight
              pagination
              rows={jobArray}
              columns={myCols}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
          </Card>
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default UserViewRight;
