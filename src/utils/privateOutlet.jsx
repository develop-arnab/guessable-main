import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsLoggedInQuery } from "../services/auth";
import Loader from "../components/Loader";
import Layout from "../layout/index";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authSlices";

export function PrivateOutlet() {
  const { data, isSuccess, isLoading } = useIsLoggedInQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  if (isLoading) {
    return <Loader />;
  } else {
    if (user || (data && data?.status && isSuccess)) {
      if (location.pathname === "/") {
        return <Navigate to="/" replace state={{ from: location }} />;
      }
      return (
        <Layout>
          <Outlet />
        </Layout>
      );
    } else {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }
}
