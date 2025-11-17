import { msalConfig } from "@/config/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication(msalConfig);