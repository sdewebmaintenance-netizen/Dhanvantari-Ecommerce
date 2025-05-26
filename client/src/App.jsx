import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/main.css";

import GuestHeader from "./components/Navigation/Header/GuestHeader";
import GuestFooter from "./components/Navigation/Footer/GuestFooter";
import UserHeader from "./components/Navigation/Header/UserHeader";
import UserFooter from "./components/Navigation/Footer/UserFooter";
import AdminFooter from "./components/Navigation/Footer/AdminFooter";
import AdminHeader from "./components/Navigation/Header/AdminHeader";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "./pages/Protected_Routes/Admin/AdminRoute";

import LandingPage from "./pages/UnProtected_Routes/LandingPage";
import GoogleCallback from "./components/Auth/GoogleCallback";

import Home from "./pages/Protected_Routes/User/Home";
import Favorites from "./pages/Protected_Routes/User/Favorites";
import ProductDetails from "./components/Protected_Routes/User/Product/ProductDetails";
import Cart from "./pages/Protected_Routes/User/Cart";
import Shop from "./pages/Protected_Routes/User/Shop";
import Profile from "./pages/Protected_Routes/User/Profile";
import Shipping from "./pages/Protected_Routes/User/Shipping";
import PlaceOrder from "./pages/Orders/PlaceOrder";
import Order from "./pages/Orders/Order";
import UserOrder from "./pages/Protected_Routes/User/UserOrder";

import UserList from "./pages/Protected_Routes/Admin/UserList";
import CategoryList from "./pages/Protected_Routes/Admin/CategoryList";
import ProductList from "./pages/Protected_Routes/Admin/ProductList";
import AllProducts from "./pages/Protected_Routes/Admin/AllProducts";
import ProductUpdate from "./pages/Protected_Routes/Admin/ProductUpdate";
import OrderList from "./pages/Protected_Routes/Admin/OrderList";
import AdminDashboard from "./pages/Protected_Routes/Admin/AdminDashboard";
import { useGetUserInfoQuery } from "./redux/api/usersApiSlice";


const App = () => {

  const {data} = useGetUserInfoQuery();     

  const renderHeader = () => {
    if (!data) {
      return <GuestHeader />;
    } else if (data.isAdmin === true) {
      return <AdminHeader />;
    } else {
      return <UserHeader />;
    }
  };

  const renderFooter = () => {
    if (!data) {
      return <GuestFooter />;
    } else if (data.isAdmin === true) {
      return <AdminFooter />;
    } else {
      return <UserFooter />;
    }
  };

  return (
    <PayPalScriptProvider>
      <BrowserRouter>
        {renderHeader()}
        <div className="container">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/callback" element={<GoogleCallback />} />

            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/favorite" element={<Favorites />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/profile" element={<Profile  />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
               <Route path="/user-orders" element={<UserOrder />} />
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route path="userlist" element={<UserList />} />
              <Route path="categorylist" element={<CategoryList />} />
              <Route path="productlist" element={<ProductList />} />
              <Route path="allproductslist" element={<AllProducts />} />
              <Route path="productlist/:pageNumber" element={<ProductList />} />
              <Route path="product/update/:id" element={<ProductUpdate />} />
              <Route path="orderlist" element={<OrderList />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
        <div id="footer">{renderFooter()}</div>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
};

export default App;
