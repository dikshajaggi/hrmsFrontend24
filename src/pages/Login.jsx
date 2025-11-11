import { loginRequest } from "@/config/authConfig";
import { useMsal } from "@azure/msal-react";
import axios from "axios";
import React from "react";

const Login = () => {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  // Call HRMS backend API (Protected Route)
  const callBackend = async () => {
    const account = accounts[0];
    if (!account) return alert("No logged-in user!");

    try {
      // Get Microsoft token silently
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const accessToken = response.accessToken;
      console.log("HRMS backend access token:", accessToken);

      // Decode token (optional debug)
      const decoded = JSON.parse(atob(accessToken.split(".")[1]));
      console.log("Decoded Microsoft token:", decoded);

      // Send token to your backend
      const res = await axios.get("http://localhost:8000/api/protected", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(" Backend response:", res.data);
      alert(`Backend says: ${res.data.message}`);
    } catch (error) {
      console.error("Backend call failed:", error);

      // Fallback if silent token fails — re-login
      instance.acquireTokenRedirect(loginRequest);
    }
  };

  return (
    <div>
      {!accounts.length ? (
        <button onClick={handleLogin}>Login with Microsoft</button>
      ) : (
        <>
          <p>Welcome, {accounts[0].username}</p>
          <button onClick={callBackend}>Call Backend API</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Login;
