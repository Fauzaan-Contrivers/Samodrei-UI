// ** React Imports
import {
  useCallback,
  useContext,
  useState,
  useEffect,
  forwardRef,
} from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";
import axios from "axios";
import { BASE_URL } from "src/configs/config";

// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "mdi-material-ui/Pencil";
import ServerSideToolbar from "src/views/table/data-grid/ServerSideToolbar";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// ** Third Party Styles Imports
import format from "date-fns/format";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";

// ** Config
import authConfig from "src/configs/auth";
import DialogUpdateFlagNumber from "src/views/components/dialogs/DialogUpdateFlagNumber";
import { onPrescriberFilterChangeHandler } from "src/store/prescribers";

/* eslint-disable */
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

const FlaggedNumbers = () => {
  // ** State
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sort, setSort] = useState("asc");
  const [prescriberId, setPrescriberId] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  // ** Hooks
  const ability = useContext(AbilityContext);

  const columns = [
    {
      flex: 0.2,
      minWidth: 70,
      headerName: "NPI",
      field: "NPI",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.NPI}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: "Name",
      field: "Name",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {`${params.row.First_Name} ${params.row.Last_Name}`}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Flagged Number",
      field: "Phone",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.Phone}
        </Typography>
      ),
    },
    {
      minWidth: 160,
      field: "TeleMarketer",
      headerName: "Tele-Markter",
      renderCell: ({ row }) => (
        <Typography variant="caption">{row?.name}</Typography>
      ),
    },
    {
      minWidth: 260,
      field: "FlagDisposition",
      headerName: "Disposition",
      renderCell: ({ row }) => (
        <Tooltip title={row?.FlagDisposition}>
          <Typography variant="caption">{row?.FlagDisposition}</Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: "Flagged Date",
      field: "FlaggedPhoneNumberDate",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {params.row.FlaggedPhoneNumberDate
            ? moment(params.row.FlaggedPhoneNumberDate)
                .local()
                .format("YYYY-MM-DD HH:mm:ss")
            : " "}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 60,
      field: "edit",
      headerName: "Edit",
      renderCell: ({ row }) => (
        <EditIcon
          onClick={() => {
            setPrescriberId(row.Id), setOpen(true);
          }}
        />
      ),
    },
  ];

  const fetchTableData = useCallback(
    async (sort, column, clientId, open) => {
      if (!open) {
        setIsLoading(true);
        await axios
          .post(`${BASE_URL}tele-prescribers/get_prescriber_flagged_number`, {
            sort,
            column,
            tele_marketer: store.prescribers.filter.teleMarketerValue,
            start_date: isNaN(Date.parse(startDate)) ? "" : startDate,
            end_date: isNaN(Date.parse(endDate)) ? "" : endDate,
            call_disposition: store.prescribers.filter.disposition.join(","),
            clientId,
          })
          .then((res) => {
            setTotal(res.data.prescribers.length);
            setRows(loadServerRows(page, res.data.prescribers));
            setIsLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, open, store.prescribers.filter]
  );

  useEffect(() => {
    fetchTableData(sort, sortColumn, userData.clientId, open);
  }, [fetchTableData, sort, sortColumn, open]);

  const handleSortModel = (newModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);
      fetchTableData(
        newModel[0].sort,
        searchValue,
        newModel[0].field,
        userData.clientId
      );
    } else {
      setSort("asc");
      setSortColumn("id");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    fetchTableData(sort, value, sortColumn, userData.clientId);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleTeleMarkterValue = (e) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "teleMarketerValue",
        value: e.target.value,
      })
    );
  };

  const handleDispositionValue = (e) => {
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "disposition",
        value: e.target.value,
      })
    );
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;

    const startDate = moment(start, "YYYY-MM-DD");
    const formattedStartDate = startDate.format("YYYY-MM-DD");

    const endDate = moment(end, "YYYY-MM-DD");
    const formattedEndStartDate = endDate.format("YYYY-MM-DD");
    if (formattedStartDate && formattedEndStartDate) {
      setStartDate(formattedStartDate);
      setEndDate(formattedEndStartDate);
    }
    if (start !== null && end !== null) {
      dispatch(
        onPrescriberFilterChangeHandler({ filter: "dates", value: dates })
      );
    }
    dispatch(
      onPrescriberFilterChangeHandler({
        filter: "startDateRange",
        value: start,
      })
    );
    dispatch(
      onPrescriberFilterChangeHandler({ filter: "endDateRange", value: end })
    );
  };

  const setDatesHandler = (val) => {
    dispatch(onPrescriberFilterChangeHandler({ filter: "dates", value: val }));
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Filters" />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Tele-Marketer"
                    onChange={handleTeleMarkterValue}
                    value={store.prescribers.filter.teleMarketerValue}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerWrapper>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={store.prescribers.filter.endDateRange}
                    selected={store.prescribers.filter.startDateRange}
                    startDate={store.prescribers.filter.startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={store.prescribers.filter.dates}
                        setDates={setDatesHandler}
                        label="Feedback submitted at"
                        end={store.prescribers.filter.endDateRange}
                        start={store.prescribers.filter.startDateRange}
                      />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="dense">
                  <InputLabel id="disposition-label">Disposition</InputLabel>
                  <Select
                    labelId="disposition-label"
                    id="disposition"
                    value={store.prescribers.filter.disposition}
                    onChange={handleDispositionValue}
                    label="Disposition"
                    multiple
                  >
                    <MenuItem value="">Select Disposition</MenuItem>
                    <MenuItem value="Wrong Number/not-in-Service">
                      Wrong Number/not-in-Service
                    </MenuItem>
                    <MenuItem value="No Answer/phone Keeping Ringing for more 5 minutes">
                      No Answer/phone Keeping Ringing for more 5 minutes
                    </MenuItem>
                    <MenuItem value="Call Answered but goes Direct to Voicemail (recorded VM option)">
                      Call Answered but goes Direct to Voicemail (recorded VM
                      option)
                    </MenuItem>
                    <MenuItem value="Call Answered with Do Not call/not interested in SOAANZ request">
                      Call Answered with Do Not call/not interested in SOAANZ
                      request
                    </MenuItem>
                    <MenuItem value="Call Answered with a Call Back Request (Call Scheduling Option)">
                      Call Answered with a Call Back Request (Call Scheduling
                      Option)
                    </MenuItem>
                    <MenuItem value="Call Answered and Directed to a Prescriber's Voicemail (recorded VM option)">
                      Call Answered and Directed to a Prescriber's Voicemail
                      (recorded VM option)
                    </MenuItem>
                    <MenuItem value="Call Answered and Detailed the listener about SOAANZ">
                      Call Answered and Detailed the listener about SOAANZ
                    </MenuItem>
                    <MenuItem value="Call Answered and Samples Requested">
                      Call Answered and Samples Requested
                    </MenuItem>
                    <MenuItem value="Call Answered and Fax Information Requested">
                      Call Answered and Fax Information Requested
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DialogUpdateFlagNumber
            open={open}
            handleClose={handleCloseDialog}
            prescriberId={prescriberId}
          />
          <CardHeader title="Flagged Numbers List" />
          <DataGrid
            autoHeight
            pagination
            rows={isLoading ? [] : rows}
            rowCount={total}
            columns={columns}
            pageSize={pageSize}
            sortingMode="server"
            paginationMode="server"
            loading={isLoading}
            onSortModelChange={handleSortModel}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row?.Id}
            onPageChange={(newPage) => setPage(newPage)}
            components={{ Toolbar: ServerSideToolbar }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            componentsProps={{
              toolbar: {
                value: searchValue,
                clearSearch: () => handleSearch(""),
                onChange: (event) => handleSearch(event.target.value),
              },
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default FlaggedNumbers;
