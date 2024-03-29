// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import chat from "src/store/apps/chat";
import user from "src/store/apps/user";
import email from "src/store/apps/email";
import invoice from "src/store/apps/invoice";
import calendar from "src/store/apps/calendar";
import permissions from "src/store/apps/permissions";
import jobs from "src/store/jobs/";
import product_advocates from "src/store/product_advocates/";
import prescribers from "src/store/prescribers/";
import samples from "src/store/samples";
import call_logs from "src/store/call_logs";
import fax_logs from "./fax_logs";
import call_scheduled from "./call_scheduled";
export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    jobs,
    product_advocates,
    prescribers,
    samples,
    call_logs,
    fax_logs,
    call_scheduled,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
