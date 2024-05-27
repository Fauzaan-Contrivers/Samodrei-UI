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

  const redirectToLogin = () => {
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)

    router.replace(authConfig.authUrl)
  }
  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      );
      if (token) {
        window.localStorage.setItem(
          authConfig.storageTokenKeyName, token
        );
      }
      if (storedToken || token) {
        setLoading(true);
        await axios
          .get(`${BASE_URL}auth/me`, {
            headers: {
              Authorization: token ? token : storedToken,
            },
          })
          .then(async (response) => {
            setLoading(false);
            console.log("me called")
            const { userData } = response?.data;

            const role = "";
            if (
              userData?.roleId === 1 ||
              userData.roleId === 3 ||
              userData.roleId === 5
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
              companyId: userData?.companyId
            };
            setUser({ ...data });

            await window.localStorage.setItem(
              "userData",
              JSON.stringify(data)
            );
            loadInitials();

            if (userData?.roleId == 1) {
              router.push("/dashboard")
            }
            else if (userData?.roleId == 4) {
              router.push("/phonebook")
            }
            else if (userData?.roleId == 5) {
              router.push("/call_logs/list")
            }
            else {
              router.push("/")
            }

            console.log("user data set")
          });
      } else {
        setLoading(false);
        redirectToLogin()
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
    // router.push("/")
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
          companyId: userData?.companyId
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
    router.replace(authConfig.authUrl);
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
