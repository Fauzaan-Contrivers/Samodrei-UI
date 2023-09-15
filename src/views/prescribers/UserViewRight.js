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
import LockOutline from "mdi-material-ui/LockOutline";
import BellOutline from "mdi-material-ui/BellOutline";
import LinkVariant from "mdi-material-ui/LinkVariant";
import AccountOutline from "mdi-material-ui/AccountOutline";
import BookmarkOutline from "mdi-material-ui/BookmarkOutline";

// ** Demo Components Imports
import UserViewBilling from "src/views/apps/user/view/UserViewBilling";
import UserViewOverview from "src/views/apps/user/view/UserViewOverview";
import UserViewSecurity from "src/views/apps/user/view/UserViewSecurity";
import UserViewConnection from "src/views/apps/user/view/UserViewConnection";
import UserViewNotification from "src/views/apps/user/view/UserViewNotification";
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
    return obj.field !== "prescriber";
  });
  // useEffect(() => {
  //   let flag = store.jobs.data.filter( val => val.prescriber.id == data.id )
  //   if(flag)
  //     setJobs(flag)
  // }, [data.id, store.jobs.data])

  useState(() => {
    setJobs(data.jobs);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              rows={jobs}
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
