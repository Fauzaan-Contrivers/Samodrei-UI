import { useEffect, useState } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

// ** Icons Imports
import Google from "mdi-material-ui/Google";
import Github from "mdi-material-ui/Github";
import Twitter from "mdi-material-ui/Twitter";
import Facebook from "mdi-material-ui/Facebook";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "src/context/AuthContext";
import { useContext } from "react";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";
import useBgColor from "src/@core/hooks/useBgColor";
import { useSettings } from "src/@core/hooks/useSettings";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const LoginIllustration = styled("img")(({ theme }) => ({
  maxWidth: "48rem",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "35rem",
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("xl")]: {
    width: "100%",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

const defaultValues = {
  password: "",
  email: "",
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();
  const bgClasses = useBgColor();
  const { login } = useContext(AuthContext);

  const {
    settings: { skin },
  } = useSettings();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  // useEffect(() => {
  //   RCAdapter.setClosed(true);
  // }, []);


  const onSubmit = async (data) => {
    const { email, password } = data;
    login({ email: email, password: password });
  };

  // // On Website B
  // window.addEventListener("message", (event) => {
  //   if (event.origin === "http://localhost:3000") {
  //     alert(event.data);
  //   }
  // });

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoginIllustrationWrapper>
            {/* <LoginIllustration
              alt='login-illustration'
              // src={`/images/pages/auth-v2-login-illustration-${theme.palette.mode}.png`}
            /> */}
            <img height={160} alt={"logo"} src="/images/favicon.png" />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 12,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img height={40} alt={"logo"} src="/images/favicon.png" />
              <Typography
                variant="h6"
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "1.5rem !important",
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5">
                Welcome to {themeConfig.templateName}!{" "}
              </TypographyStyled>
              <Typography variant="body2">
                Please sign-in to your account
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="Email"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ marginBottom: 7, mt: 4 }}
              >
                Login
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
