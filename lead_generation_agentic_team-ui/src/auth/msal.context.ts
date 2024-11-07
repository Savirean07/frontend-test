import { createContext, useContext } from "react";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";

export type User = { id: string, name: string, email: string, role: string } | null;
export type Notification = { type: "success" | "error", title: string, description: string, id: number | string } | null;

export interface MsalContextType {
  msalInstance: PublicClientApplication | null;
  user?: User;
  account?: AccountInfo | null;
  authority: string | null;
  setAuthority: (authority: string) => void;
  signIn?: {
    withGoogle: () => Promise<void>;
    withMicrosoft: () => Promise<void>;
  };
  signOut?: () => Promise<void>;
  pushNotification: (notification: Notification) => void;
}

export const MsalContext = createContext<MsalContextType>({
  msalInstance: null,
  user: null,
  account: null,
  authority: null,
  setAuthority: () => { },
  signOut: () => Promise.resolve(),
  pushNotification: () => Promise.resolve(),
});

export const useMsal = () => useContext(MsalContext);