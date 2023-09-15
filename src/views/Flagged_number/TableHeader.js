import Link from "next/link";
import { forwardRef, Fragment, useState } from "react";

// ** Third Party Imports
import DatePicker from "react-datepicker";
import format from "date-fns/format";
import moment from "moment";

// ** MUI Imports
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

import { useDispatch, useSelector } from "react-redux";
import {
  convertTimeZoneToReadableDate,
  convertTimeZoneToReadableTime,
} from "src/configs/utils";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogBox = ({
  onDownloadClickHandler,
  open,
  setOpen,
  handleClickOpen,
  handleClose,
}) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState([]);

  const CustomInput = forwardRef((props, ref) => {
    const startDate = Boolean(props.start)
      ? format(props.start, "MM/dd/yyyy")
      : "";
    const endDate = Boolean(props.end)
      ? ` - ${format(props.end, "MM/dd/yyyy")}`
      : null;
    const value = `${startDate}${endDate !== null ? endDate : ""}`;
    props.start === null && props.dates.length && props.setDates
      ? props.setDates([])
      : null;
    const updatedProps = { ...props };
    delete updatedProps.setDates;
    return (
      <TextField
        fullWidth
        inputRef={ref}
        {...updatedProps}
        label={props.label || ""}
        value={value}
      />
    );
  });

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDate(date);
    }
    setStart(start);
    setEnd(end);
  };

  const setDatesHandler = (val) => {
    setDate(val);
  };

  
  return (
    <Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiPaper-root": {
            width: "700px",
            height: "580px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Select The Lunch Dates
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px", paddingLeft: "10px" }}>
          <DatePickerWrapper>
            <DatePicker
              isClearable
              selectsRange
              monthsShown={2}
              endDate={end}
              startDate={start}
              shouldCloseOnSelect={false}
              id="date-range-picker-months"
              onChange={handleOnChangeRange}
              customInput={
                <CustomInput
                  dates={date}
                  setDates={setDatesHandler}
                  label="Slect Lunch Dates Range"
                  end={end}
                  start={start}
                />
              }
            />
          </DatePickerWrapper>
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            onClick={() => onDownloadClickHandler(start, end)}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const TableHeader = (props) => {
    // console.log("props in flagged number", props.dataCSV);
  const store = useSelector((state) => state);

  const handleClickDownloadDataCSV = () => {
    // Call the function to open the dialog for selecting date range
    handleClickOpen();
  };
  
  const downloadCSV = (start, end) => {
    let jobsData = props.dataCSV;
    // console.log("jobs data", jobsData);
    // if (start) {
    //   jobsData = jobsData.filter((val) =>
    //     moment(val.question_l_0).isSameOrAfter(moment(start), "D")
    //   );
    // }
    // if (end) {
    //   jobsData = jobsData.filter((val) =>
    //     moment(val.question_l_0).isSameOrBefore(moment(end), "D")
    //   );
    // }
    // let lunchData = jobsData.filter((val) => val.question_1);
    let csv =
      "NPI,Name,Flagged Number, Tele-Marketer,Disposition,Flagged Date\n";
    // csv +=
    //   'NPI,Name,Flagged Number,Tele-Marketer,Disposition,Flagged date\n';


    jobsData.forEach(function (row) {
        // console.log('row.NPI', row.name);
      csv += `${row.NPI},`;
      csv += `${row.First_Name} ${row.Last_Name},`;
      csv += `${row.Phone},`;
      csv += `${row.name},`;
      csv += `${row.FlagDisposition},`;
      csv += `${row.FlaggedPhoneNumberDate},`;
    //   csv += ","; // unit
    //   csv += `"${row.prescriber.Street_Address?.replace(/#/g, "")}",`;
    //   csv += `${row.prescriber.City},`;
    //   csv += `${row.prescriber.State},`;
    //   csv += `${row.prescriber.Zip},`;
    //   csv += `${row.prescriber.Phone},`;
    //   csv += `"${row.question_l_1A}",`;
    //   csv += `"${row.question_l_1B}",`;
    //   csv += `"${row.question_l_1C}",`;
    //   csv += `"${row.question_l_1D}",`;
    //   csv += ","; //Empty Column
    //   csv += `"${row.question_l_2}",`;
    //   csv += parseFloat(row.question_l_2 / row.question_l_1A).toFixed(2) + ",";
    //   csv += `${row.question_l_4},`;
    //   csv += convertTimeZoneToReadableDate(row.question_l_0) + ","; // date
    //   csv += convertTimeZoneToReadableTime(row.question_l_0) + ","; // time
    //   csv += `${row.product_advocate.Name},`;

      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Lunch Data.csv";
    hiddenElement.click();
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box></Box>
      <DialogBox
        open={open}
        setOpen={setOpen}
        onDownloadClickHandler={downloadCSV}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
      <Box>
        {/* <Button
          sx={{ mb: 2, mr: 2 }}
          onClick={handleClickOpen}
          variant="contained"
        >
          Download Lunch CSV
        </Button> */}
        <Button
          sx={{ mb: 2, mr: 2 }}
        //   onClick={() => props.onClick()}
        // onClick={handleClickDownloadDataCSV}
        onClick={downloadCSV}
          variant="contained"
        >
          Download Data CSV
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;