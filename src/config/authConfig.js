const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_AZURE_REDIRECT_URI;
const BACKEND_ID = import.meta.env.VITE_AZURE_BACKEND_ID; // your backend app's Client ID (from Azure)

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
    redirectUri: REDIRECT_URL,
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage"
    storeAuthStateInCookie: false,
  },
};

// 👇 Only request basic Microsoft identity + backend API access
export const loginRequest = {
  scopes: [
    "openid",          // for OpenID Connect identity
    "profile",         // for basic user info (name, username)
    "email",           // for email claim
    `api://${BACKEND_ID}/access_as_user`, // for your HRMS backend API
  ],
};
