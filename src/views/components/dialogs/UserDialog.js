import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import authConfig from "src/configs/auth";
import { BASE_URL } from "src/configs/config";
import toast from "react-hot-toast";

const UserDialog = ({ open, handleClose, fields, company }) => {
  const userData = JSON.parse(window.localStorage.getItem(authConfig.userData));

  const [state, setState] = useState({
    name: "",
    email: "",
    roleId: 1,
    company_name: "",
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}user/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const data = await response.json();
      console.log("DATA", data);
      if (data.status == 200) {
        toast.success(data.message, {
          duration: 2000,
        });
      }

      if (data.status == 400) {
        toast.error(data.message, {
          duration: 2000,
        });
      }
      handleClose();
    } catch (error) {
      console.log("CHECK", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          width: "fit-content",
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{fields}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogActions className="dialog-actions-dense">
          <FormControl sx={{ width: 550, padding: 5, mb: 1 }}>
            <FormControl fullWidth>
              <TextField
                required
                type="text"
                value={state.name}
                onChange={handleChange}
                id="standard-basic"
                name="name"
                label="Name"
                placeholder="Enter Name"
                variant="standard"
                sx={{ marginBottom: 5 }}
              />
              <TextField
                required
                type="email"
                value={state.email}
                onChange={handleChange}
                id="standard-basic"
                name="email"
                label="Email"
                placeholder="Enter Email"
                variant="standard"
                sx={{ marginBottom: 5 }}
              />
              {userData.roleId == 1 && fields === "REGISTER COMPANY" ? (
                <TextField
                  required
                  type="text"
                  value={state.company_name}
                  onChange={handleChange}
                  id="standard-basic"
                  name="company_name"
                  label="Company Name"
                  placeholder="Enter Company Name"
                  variant="standard"
                  sx={{ marginBottom: 5 }}
                />
              ) : null}
            </FormControl>
            {fields === "INVITE USER" && (
              <FormControl fullWidth>
                <FormControl fullWidth sx={{ mb: 5 }}>
                  <InputLabel id="standard-basic">SELECT ROLE</InputLabel>
                  <Select
                    fullWidth
                    required
                    label="roleId"
                    id="standard-basic"
                    onChange={handleChange}
                    labelId="invoice-status-select"
                    name="roleId"
                    value={state.roleId}
                    variant="standard"
                  >
                    {userData.roleId == 1 ? (
                      <MenuItem value={3}>ADMIN</MenuItem>
                    ) : null}
                    <MenuItem value={2}>CLIENT</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="standard-basic">SELECT COMPANY</InputLabel>
                  <Select
                    fullWidth
                    required
                    label="company"
                    id="standard-basic"
                    onChange={handleChange}
                    labelId="invoice-status-select"
                    name="company_name"
                    value={state.company_name}
                    variant="standard"
                  >
                    {company.map((item) => (
                      <MenuItem key={item.Id} value={item.Name}>
                        {item.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormControl>
            )}
            <FormControl sx={{ width: 500, padding: 5, mb: 1 }}>
              <Button type="submit" variant="contained" sx={{ mt: 1, mb: 1 }}>
                Add
              </Button>
              <Button onClick={handleClose} sx={{ mt: 1, mb: 1 }}>
                Close
              </Button>
            </FormControl>
          </FormControl>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
