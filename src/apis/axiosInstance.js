import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "@/config/authConfig";
import { msalInstance } from "./msalInstance";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// 🚀 Request Interceptor (attach token automatically)
api.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();

  if (!accounts.length) return config;

  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });

    config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
  } catch (err) {
    console.error("Silent token failed. Forcing redirect...", err);
    await msalInstance.acquireTokenRedirect(loginRequest);
  }

  return config;
});

export default api;
