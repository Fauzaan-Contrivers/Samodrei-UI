import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import moment from "moment";
import { debounce } from "lodash";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Store & Actions Imports
import {
  addDisabledPrescriber,
  fetchPrescribersforPhoneLogs,
  updateDisabledPrescriber,
  onPrescriberFilterChangeHandler,
  onCallLogFilterChangeHandler,
} from "src/store";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Configs
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";

// ** Next Import
import Link from "next/link";

const PhoneBook = () => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { socket } = store.call_logs.filter;
  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  useEffect(() => fetchPrescribersOnUpdate(), [store.prescribers.filter.page, store.prescribers.filter.pageSize]);
  useEffect(() => setupRingCentralScript(), []);
  useEffect(() => initializeSocket(), []);
  useEffect(() => configureSocketEvents(socket), [socket]);

  const fetchPrescribersOnUpdate = () => {
    setIsLoading(true);
    const fetchPrescribersDataWithDebounce = debounce(() => {
      dispatch(fetchPrescribersforPhoneLogs({
        page_num: store.prescribers.filter.page + 1,
        page_size: store.prescribers.filter.pageSize,
      }))
      .then(() => {
        setPage(store.prescribers.filter.page);
        setIsLoading(false);
      });
    }, 2000);

    fetchPrescribersDataWithDebounce();
    return fetchPrescribersDataWithDebounce.cancel;
  };

  const setupRingCentralScript = () => {
    const rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/ringcentral-embeddable/adapter.js";
    rcs.onload = () => {
      RCAdapter.setClosed(true);
      console.log("Script has been loaded successfully!");
    };
    document.body.appendChild(rcs);

    return () => rcs.remove();
  };

  const initializeSocket = () => {
    const newSocket = io.connect(BASE_URL, { transports: ["websocket"] });
    dispatch(onCallLogFilterChangeHandler({ filter: "socket", value: newSocket }));
  };

  const configureSocketEvents = (socket) => {
    if (socket) {
      socket.on("message", (prescriberId) => {
        dispatch(addDisabledPrescriber(prescriberId));
        updatePrescriberCallStatus(prescriberId, true);
      });
      socket.on("enable_prescriber", (prescriberId) => {
        dispatch(updateDisabledPrescriber(prescriberId));
      });
    }
  };

  const updatePrescriberCallStatus = async (prescriberId, flag) => {
    try {
      const response = await fetch(`${BASE_URL}tele-prescribers/update_tele_prescriber_call_status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriberId, flagged: flag }),
      });
      console.log("DATA", await response.json());
    } catch (error) {
      console.error("CHECK", error);
    }
  };

  const onActionClick = (prescriberId) => socket.emit("message", prescriberId);
  const isActionDisabled = (prescriberId) => store.prescribers.disabledPrescribers[prescriberId];

  const columns = defineColumns();

  return (
    <div>
      {ability?.can("read", "acl-page") && (
        <Grid item xs={12}>
          <Card>
            <DataGrid
              // ... other props
            />
          </Card>
        </Grid>
      )}
    </div>
  );
};

const defineColumns = () => {
  // ... your columns definition
  return [...defaultColumns];
};

PhoneBook.acl = {
  action: "read",
  subject: "acl-page",
};

export default PhoneBook;