import Link from "next/link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { convertDateToReadableFormat } from "src/configs/utils";
import moment from "moment";

const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

export const jobsListViewColumns = [
  {
    field: "Job_Id",
    minWidth: 80,
    headerName: "Id",
    renderCell: ({ row }) => (
      <Link href={`/jobs/preview/${row.Job_Id}`} passHref>
        <StyledLink>{`${row.Job_Id}`}</StyledLink>
      </Link>
    ),
  },
  {
    minWidth: 160,
    field: "Status",
    headerName: "Status",
    renderCell: ({ row }) => {
      <Typography
        variant="caption"
        sx={{ color: "common.white", fontWeight: 600 }}
      >
        {row.Status}
      </Typography>;
    },
  },
  {
    flex: 0.5,
    field: "Prescriber",
    minWidth: 300,
    headerName: "Prescriber",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Link href={`/prescribers/preview/${row?.PrescriberId}`} passHref>
              <StyledLink>{row?.Prescriber_Name}</StyledLink>
            </Link>
            <Typography noWrap variant="caption">
              {`${row?.Street_Address}, ${row?.City}, ${row?.State}, ${row?.Zip}`}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.5,
    field: "product_advocate_name",
    minWidth: 200,
    headerName: "Product Advocate",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Link
              href={`/product_advocates/preview/${row?.ProductAdvocateId}`}
              passHref
            >
              <StyledLink>{row?.Product_Advocate_Name}</StyledLink>
            </Link>
            <Typography noWrap variant="caption">
              {row?.Product_Advocate_Email}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 190,
    field: "feedback_submitted_at",
    headerName: "Feedback Submitted At",
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row?.feedback_submitted_at
          ? moment(row.feedback_submitted_at)
              .local()
              .format("YYYY-MM-DD HH:mm:ss")
          : " "}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 160,
    field: "difference_location_doctor",
    headerName: "Feedback Distance",
    renderCell: ({ row }) => {
      var target = parseFloat(row.difference_location_doctor);

      return (
        <Typography
          style={{
            color: target ? (target > 0.1 ? "red" : "green") : "initial",
          }}
          variant="body2"
        >
          {target ? target.toFixed(2) : ""}
        </Typography>
      );
    },
  },
];
