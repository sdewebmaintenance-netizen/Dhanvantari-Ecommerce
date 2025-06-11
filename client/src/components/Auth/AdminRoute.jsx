import { Navigate, Outlet } from "react-router-dom";
import { useGetUserInfoQuery } from "../../redux/api/usersApiSlice";
import Loader from "../../components/Common/Loader";

const AdminRoute = () => {
  const {
    data: userInfo,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserInfoQuery();

  if (isLoading || isFetching) {
    return <Loader />; 
  }

  if (isError || !userInfo || !userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
