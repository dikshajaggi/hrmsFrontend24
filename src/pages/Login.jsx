import { loginRequest } from "@/config/authConfig";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { instance, accounts } = useMsal();

  const handleLogin = () => instance.loginRedirect(loginRequest);
  const handleLogout = () => instance.logoutRedirect();

  return (
    <div>
      {!accounts.length ? (
        <button onClick={handleLogin}>Login with Microsoft</button>
      ) : (
        <>
          <p>Welcome, {accounts[0].username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Login
