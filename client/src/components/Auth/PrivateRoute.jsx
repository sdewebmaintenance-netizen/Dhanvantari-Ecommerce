import { Navigate, Outlet } from "react-router-dom";
import Loader from "../../components/Common/Loader";
import { useGetUserInfoQuery } from "../../redux/api/usersApiSlice";


const PrivateRoute = () => {
  const  token = localStorage.getItem('token');
  const {
    isLoading,
    isFetching
  } = useGetUserInfoQuery();

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return token ? <Outlet /> : <Navigate to="/" replace />;
};  

export default PrivateRoute;
