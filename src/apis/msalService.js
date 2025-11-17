import { loginRequest } from "@/config/authConfig";

export const getAccessToken = async (instance, accounts) => {
  const account = accounts[0];
  if (!account) throw new Error("User not logged in");

  try {
    // Try silent token
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    return response.accessToken;
  } catch (err) {
    // Silent token failed → force login again
    instance.acquireTokenRedirect(loginRequest);
    throw new Error("Token refresh failed", err);
  }
};
