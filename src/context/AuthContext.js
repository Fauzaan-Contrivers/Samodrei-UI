// ** React Imports
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ** Next Import
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";

import {
  setJobsLoadingTrue,
  fetchJobsData,
  setPrescribersLoadingTrue,
  fetchPrescribersData,
  setProductAdvocatesLoadingTrue,
  fetchProductAdvocatesData,
  fetchSamplesData,
} from "src/store/export";
import { BASE_URL } from "src/configs/config";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state);

  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      );
      if (storedToken) {
        setLoading(true);
        await axios
          .get(`${BASE_URL}auth/me`, {
            headers: {
              Authorization: storedToken,
            },
          })
          .then(async (response) => {
            setLoading(false);
            const { userData } = response?.data;

            const role = "";
            if (
              userData?.roleId === 1 ||
              userData?.roleId === 3 ||
              userData?.roleId === 5
            ) {
              role = "admin";
            }
            if (userData?.roleId === 4) {
              role = "client";
            }

            const data = {
              id: userData?.id,
              role: role,
              fullName: userData?.name || "",
              email: userData?.email,
              roleId: userData?.roleId,
            };
            setUser({ ...data });
          });
        loadInitials();
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loadInitials = () => {
    //console.log("Initial point if I am logged in!");
    dispatch(setPrescribersLoadingTrue());
    dispatch(setProductAdvocatesLoadingTrue());
    dispatch(setJobsLoadingTrue());
    dispatch(fetchPrescribersData());
    dispatch(fetchProductAdvocatesData());
    dispatch(fetchJobsData());
    dispatch(fetchSamplesData());
  };

  const authUser = () => {
    axios
      .get(`${BASE_URL}auth/me`, {
        headers: {
          Authorization: window.localStorage.getItem(
            authConfig.storageTokenKeyName
          ),
        },
      })
      .then(async (response) => {
        const returnUrl = router.query.returnUrl;
        const { userData } = response.data;
        const role = "";

        if (
          userData.roleId === 1 ||
          userData.roleId === 3 ||
          userData.roleId === 5
        ) {
          role = "admin";
        }
        if (userData.roleId === 4) {
          role = "client";
        }

        const data = {
          id: userData?.id,
          role: role,
          fullName: userData?.name || "",
          email: userData?.email,
          roleId: userData?.roleId,
        };
        setUser({ ...data });
        await window.localStorage.setItem(
          "userData",
          JSON.stringify(response.data.userData)
        );
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL);
      });

    loadInitials();
  };

  const handleLogin = (params, errorCallback) => {
    axios.post(`${BASE_URL}auth/login`, params).then(async (res) => {
      if (res.data.accessToken) {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.accessToken
        );

        authUser();
      }
      if (res.data.statusCode == 403 || res.data.statusCode == 401) {
        toast.error(res.data.message, {
          duration: 2000,
        });
      }
    });
  };

  const handleLogout = () => {
    const { socket } = store.call_logs.filter;
    if (socket && socket.connected) {
      socket.disconnect();
    }
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push("/login");
  };

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err) => (errorCallback ? errorCallback(err) : null));
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
