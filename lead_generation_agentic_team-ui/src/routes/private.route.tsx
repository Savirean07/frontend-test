import { Navigate, Outlet } from "react-router-dom";
import { useMsal } from "../auth";

const PrivateRoute = () => {
  const { msalInstance } = useMsal();
  if (!msalInstance?.getActiveAccount()) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
