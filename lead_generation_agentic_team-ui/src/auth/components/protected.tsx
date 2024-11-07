import { Navigate, useResolvedPath } from "react-router-dom";
import { useMsal } from "../msal.context";
import React from "react";

interface ProtectedComponentProps {
  children?: React.ReactNode;
  condition?: boolean;
  redirect?: string;
}

export const ProtectedComponent = ({
  children,
  condition,
  redirect,
}: ProtectedComponentProps) => {
  const { msalInstance } = useMsal();
  const redirectPath = useResolvedPath(redirect || "/login");
  const activeUser = condition || !!msalInstance?.getActiveAccount();
  if (!activeUser) {
    return <Navigate to={redirectPath} />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};
