// ** React Imports
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import Check from "mdi-material-ui/Check";
import Close from "mdi-material-ui/Close";
import themeConfig from "src/configs/themeConfig";
import { convertDateToReadableFormat } from "src/configs/utils";
import { fetchJobData } from "src/store/jobs";

const Preview = ({ id, invoiceData }) => {
  // ** State
  // const [error, setError] = useState(true)
  const store = useSelector((state) => state);
  const [data, setData] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();

  const StyledLink = styled("a")(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.primary.main,
  }));

  const MUITableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: 0,
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    paddingTop: `${theme.spacing(1)} !important`,
    paddingBottom: `${theme.spacing(1)} !important`,
  }));

  useEffect(() => {
    dispatch(fetchJobData({ id }));
  }, [id]);

  useEffect(() => {
    setData(store.jobs.jobData);
  }, [store.jobs.jobData]);

  if (data) {
    console.log(data)
    return (
      <Card>
        <CardHeader
          title={"Job Details"}
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">ID:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {data.Id}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">Status:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {data.Status}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">Prescriber:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          <Link
                            href={`/prescribers/preview/${data.p_Id}`}
                            passHref
                          >
                            <StyledLink>{data.first_name}</StyledLink>
                          </Link>
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">
                          Product Advocate:
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          <Link
                            href={`/product_advocates/preview/${data.pa_Id}`}
                            passHref
                          >
                            <StyledLink>{data.pa_Name}</StyledLink>
                          </Link>
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        {data.Status == "Feedback completed" && (
          <>
            <Divider />

            <CardHeader
              title={"Feedback Details"}
              titleTypographyProps={{ variant: "h6" }}
            />

            <CardContent>
              <Grid container>
                <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Was it a lunch meeting?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_1 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Who did you meet with?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data.question_2}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "50%" }}
                              variant="body2"
                            >
                              Was there any clinical question that requires a
                              follow-up?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_7 ? (
                              <Typography
                                sx={{ maxWidth: "50%", fontWeight: 600 }}
                                variant="body2"
                              >
                                {data?.question_7A}
                              </Typography>
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Have you explained how a SOAANZ prescription can
                              be sent to our mail order pharmacy?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_9 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you mention our 30-day free sample program?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_10 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you leave the promotional material with the
                              person you met?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_11 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "60%" }}
                              variant="body2"
                            >
                              Did you collect contact information of the person
                              you met?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_12 ? (
                              <>
                                <Typography
                                  sx={{ maxWidth: "80%" }}
                                  variant="body2"
                                >
                                  {data?.question_12A}
                                </Typography>
                                <Typography
                                  sx={{ maxWidth: "80%" }}
                                  variant="body2"
                                >
                                  {data?.question_12B}
                                </Typography>
                                <Typography
                                  sx={{ maxWidth: "80%" }}
                                  variant="body2"
                                >
                                  {data?.question_12C}
                                </Typography>
                              </>
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "60%" }}
                              variant="body2"
                            >
                              Have you scheduled a next visit?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_13 ? (
                              <>
                                <Typography
                                  sx={{ maxWidth: "80%" }}
                                  variant="body2"
                                >
                                  {convertDateToReadableFormat(
                                    data?.question_13A
                                  )}
                                </Typography>
                              </>
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", sm: "flex-end" },
                    }}
                  >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you discuss how generic loop diuretics worsen
                              bladder problems, especially in elderly patients?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_3 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you mention that many patients skip their
                              diuretic dose because of worsening bladder
                              problems?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_4 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did mention that SOAANZ may help these patients
                              and explain why?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_5 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you request the physician or the person who
                              you met to write “Dispense as Written” or “DAW” to
                              avoid conversion to generic torsemide?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_6 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "80%" }}
                              variant="body2"
                            >
                              Did you inform the prescriber that SOAANZ can be
                              purchased at a low fixed price from our mail order
                              pharmacy?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            {data?.question_8 ? (
                              <Check sx={{ fontSize: "1rem" }} />
                            ) : (
                              <Close sx={{ fontSize: "1rem" }} />
                            )}
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography
                              sx={{ maxWidth: "50%" }}
                              variant="body2"
                            >
                              Write your personal observations
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant="body2">
                              {data?.question_14}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </>
        )}

        {data.question_1 && (
          <>
            <Divider />

            <CardHeader
              title={"Lunch Details"}
              titleTypographyProps={{ variant: "h6" }}
            />

            <CardContent>
              <Grid container>
                <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Physician/PA/NP name
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.first_name}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">Specialty</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.specialty}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">Address</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.address1}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              How many people attended the lunch
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_1A}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              How many physicians, NPs, and PAs?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_1C}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Total cost of lunch
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_2}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>

                <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">NPI number</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.npi}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">Drug (NDC#)</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              SOAANZ (NDCs:
                              73502-586-10;73502-687-13;73502-786-07)
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Phone number
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.phone_office}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Date and Time
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {convertDateToReadableFormat(data?.question_l_0)}
                            </Typography>
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Names of persons (seperated by comma)
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_1B}
                            </Typography>
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Name and NPIs of physicians, NPs, and PAs?
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_1D}
                            </Typography>
                          </MUITableCell>
                        </TableRow>

                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">
                              Physician/NP/PA cost
                            </Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              $
                              {data?.question_l_2 && data?.question_l_1A
                                ? data?.question_l_2 / data?.question_l_1A
                                : "N/A"}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant="body2">Category</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {data?.question_l_4}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </>
        )}
      </Card>
    );
  } else if (!data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">Job with the id: {id} does not exist.</Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default Preview;
