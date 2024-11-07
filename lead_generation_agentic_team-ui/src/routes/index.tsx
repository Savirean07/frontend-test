import React from "react";
import {
  Navigate,
  Route,
  RouteProps,
  Outlet,
  OutletProps,
} from "react-router-dom";
import NavBar from "../components/nav-bar";
import Footer from "src/components/footer";

export const RouteWithNav: React.FC<RouteProps> = () => {
  return (
    <React.Fragment>
      <NavBar />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
};

type PrivateRouteProps = OutletProps & {
  isAuthenticated: boolean;
  restrictedPath: string;
};

const ProtectedRoute: React.FC<PrivateRouteProps> = (props) => {
  const { restrictedPath } = props;
  if (!props.isAuthenticated) {
    // redirect(restrictedPath); // Redirect to login page
    return <Navigate to={restrictedPath} />;
  }
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default ProtectedRoute;

const PublicRoute: React.FC<OutletProps> = () => {
  return <Outlet />;
};

type FallbackRouteProps = RouteProps & {
  fallbackPath: string;
};

const FallbackRoute: React.FC<FallbackRouteProps> = ({ ...routeProps }) => {
  return <Route {...routeProps} element={<Navigate to={"/404"} />} />;
};

export { ProtectedRoute, PublicRoute, FallbackRoute };
