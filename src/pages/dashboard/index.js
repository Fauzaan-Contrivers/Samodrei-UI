import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment/moment";

// ** MUI Imports
import Grid from "@mui/material/Grid";

import { useContext } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

import RechartsLineChart from "src/views/charts/recharts/RechartsLineChart";
import RechartsPieChart from "src/views/charts/recharts/RechartsPieChart";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import RechartsWrapper from "src/@core/styles/libs/recharts";

import CrmStatisticsCard from "src/views/dashboard/CrmStatisticsCard";
import { check } from "prettier";
import { fetchDashboardData } from "src/store/prescribers";

const CRMDashboard = () => {
  const [states, setStates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [samples, setSamples] = useState([]);
  const [visits, setVisits] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [seed, setSeed] = useState(1);
  const ability = useContext(AbilityContext);

  //Storing Data in an Array for Further Manipulation
  const store = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setStates(store.prescribers.data);
  }, [store.prescribers.data]);

  useEffect(() => {
    setSamples(store.samples.data);
  }, [store.samples.data]);

  useEffect(() => {
    setJobs(store.jobs.data);
  }, [store.jobs.data]);

  useEffect(() => {
    setSeed(Math.random());
  }, [dashboardData]);

  useEffect(() => {
    dispatch(fetchDashboardData()).then(() => {});
  }, []);

  useEffect(() => {
    setDashboardData(store.prescribers.dashboardData);
  }, [store.prescribers.dashboardData]);

  let arr = [];
  jobs.filter((name) => {
    arr.push(name.prescriber_name);
  });

  //filterig all unique Prescribers Name out of all Prescribers
  let uniqueArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (!uniqueArray.includes(arr[i])) {
      uniqueArray.push(arr[i]);
    }
  }

  // Number of Presubscribers Covered
  const PrescribersCovered = dashboardData?.visited?.count;

  const repeatVisit = dashboardData?.revisited;

  let fd_Count = 0;
  let md_Count = 0;
  let np_Count = 0;
  let ph_Count = 0;
  let pa_Count = 0;
  let om_Count = 0;
  let nurse_Count = 0;

  if (dashboardData?.totalVisits?.length > 0) {
    fd_Count =
      parseInt(dashboardData?.totalVisits[0].count) +
      parseInt(dashboardData?.totalVisits[2].count);
    md_Count = parseInt(dashboardData?.totalVisits[1].count);
    np_Count = parseInt(dashboardData?.totalVisits[3].count);
    ph_Count = parseInt(dashboardData?.totalVisits[4].count);
    om_Count = parseInt(dashboardData?.totalVisits[5].count);
    pa_Count = parseInt(dashboardData?.totalVisits[6].count);
    nurse_Count = parseInt(dashboardData?.totalVisits[7].count);
  }

  let lm_Count = dashboardData?.lunch_meetings;

  jobs.map((jobItem) => {
    if (jobItem.question_2__c == "Front Desk Staff") {
      fd_Count++;
    }
    if (jobItem.question_2__c == "Medical Assistant (MA)") {
      md_Count++;
    }
    if (jobItem.question_2__c == "Physician") {
      ph_Count++;
    }

    if (jobItem.question_2__c == "Office Manager") {
      om_Count++;
    }
    if (jobItem.question_2__c == "Physician’s Assistant (PA)") {
      pa_Count++;
    }
    if (jobItem.question_2__c == "Nurse Practitioner (NP)") {
      np_Count++;
    }
    if (jobItem.question_1__c) {
      lm_Count++;
    }
  });

  //# of samples distributed and there amount in $
  let c_20_Delived_Count = 0;
  let c_60_Delived_Count = 0;
  samples.map((sampleData) => {
    if (sampleData.Status__c == "delivered") {
      c_20_Delived_Count += sampleData.Quantity_20__c;
      c_60_Delived_Count += sampleData.Quantity_60__c;
    }
  });

  function getMonthRanges() {
    const monthRanges = [];
    const today = moment();
    for (let i = 0; i < 6; i++) {
      const startOfMonth = today.clone().subtract(i, "month").startOf("month");
      const endOfMonth = today.clone().subtract(i, "month").endOf("month");
      const monthName = startOfMonth.format("MMM");
      monthRanges.push({
        start: startOfMonth,
        end: endOfMonth,
        month: monthName,
      });
    }
    const formattedRanges = monthRanges.map((range) => {
      return {
        start: range.start.format("YYYY/MM/DD"),
        end: range.end.format("YYYY/MM/DD"),
        month: range.month,
      };
    });
    return formattedRanges;
  }

  const monthRange = getMonthRanges();

  // Finding Doctor visited per month
  for (var i = 5; i >= 0; i--) {
    var t = dashboardData.prescribersVisitedPerMonth?.result[i]?.totalCount;
    monthRange[5 - i].visit = t;
  }

  const data = [
    {
      title: "Revisited",
      color: "primary",
      // icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      title: "Samples",
      color: "success",
      // icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      color: "warning",
      title: "Lunch Meetings",
      // icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    },
  ];

  data[0].stats = repeatVisit;
  data[1].stats = dashboardData?.samplesDistributed || "";
  data[2].stats = lm_Count;

  const bestAdvData = [
    {
      title: "Total Visits",
      color: "primary",
      stats: 20,
      // icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
  ];
  // console.log(bestAdvData)

  if (jobs.length !== 0) {
    const filterObjArray = [];
    jobs.filter((job) => {
      const formatedDate = moment(job.CreatedDate).format("YYYY/MM/DD");
      if (
        formatedDate >= moment().subtract(8, "days").format("YYYY/MM/DD") &&
        formatedDate <= moment().subtract(1, "days").format("YYYY/MM/DD")
      ) {
        filterObjArray.push(job);
      }
    });

    let objectCount = filterObjArray.reduce((counts, object) => {
      counts[object.product_advocate.id] =
        (counts[object.product_advocate.id] || 0) + 1;
      return counts;
    }, {});
    let maxCount = Math.max(...Object.values(objectCount));
  }
  console.log();
  const bestAdvName =
    dashboardData?.bestProductAdvocate?.productAdvocate[0]?.Name || "";
  bestAdvData[0].stats = dashboardData?.bestProductAdvocate?.count;

  return (
    <div>
      {ability?.can("read", "acl-page") ? (
        <>
          <ApexChartWrapper>
            <Grid container rowSpacing={1} columnSpacing={1}>
              <Grid item xs={12} md={6}>
                <CrmStatisticsCard
                  title={"Prescriber"}
                  header={`Total ${PrescribersCovered} Prescribers Visited`}
                  dataObj={data}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CrmStatisticsCard
                  title={"Product Advocate of The Week"}
                  header={`${bestAdvName}`}
                  dataObj={bestAdvData}
                />
              </Grid>
            </Grid>
          </ApexChartWrapper>
          <div style={{ marginTop: "5px" }}>
            <RechartsWrapper>
              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs={12} md={6}>
                  <RechartsLineChart visitMonthly={monthRange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RechartsPieChart
                    fd={fd_Count}
                    ma={md_Count}
                    nurse={nurse_Count}
                    np={np_Count}
                    ph={ph_Count}
                    om={om_Count}
                    pa={pa_Count}
                    key={seed}
                  />
                </Grid>
              </Grid>
            </RechartsWrapper>
          </div>
        </>
      ) : null}
    </div>
  );
};

CRMDashboard.acl = {
  action: "read",
  subject: "acl-page",
};

export default CRMDashboard;
