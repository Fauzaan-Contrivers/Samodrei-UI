// ** React Imports
import { forwardRef, useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import moment from "moment/moment";

// ** Third Party Imports
import format from "date-fns/format";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";

// ** Icons Imports
import ChevronDown from "mdi-material-ui/ChevronDown";
import CalendarOutline from "mdi-material-ui/CalendarOutline";

const TimeSpentBarChart = (props) => {
  // ** Props
  const { yellow, labelColor, borderColor, gridLineColor } = props;

  // ** States
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          borderColor,
          color: gridLineColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: 8,
        grid: {
          borderColor,
          color: gridLineColor,
        },
        ticks: {
          stepSize: 1,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const data = {
    labels: [],
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: yellow,
        borderColor: "transparent",
        borderRadius: { topRight: 15, topLeft: 15 },
        data: [],
      },
    ],
  };

  props.data.forEach((item) => {
    const formattedDate = moment(item.date).local().format("MMM DD");
    const timeSpent = parseFloat(Number(item.timeSpent).toFixed(2) / 60);

    data.labels.push(formattedDate);
    data.datasets[0].data.push(timeSpent);
  });

  console.log(data);

  return (
    <Card>
      <CardHeader
        title="Time Spent Per Day (HOURS)"
        titleTypographyProps={{ variant: "h6" }}
        sx={{
          flexDirection: ["column", "row"],
          alignItems: ["flex-start", "center"],
          "& .MuiCardHeader-action": { marginBottom: 0 },
          "& .MuiCardHeader-content": { marginBottom: [2, 0] },
        }}
      />
      <CardContent>
        <Bar data={data} options={options} height={390} />
      </CardContent>
    </Card>
  );
};

export default TimeSpentBarChart;
