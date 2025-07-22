import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/main.css";

import GuestHeader from "./components/Navigation/Header/GuestHeader";
import GuestFooter from "./components/Navigation/Footer/GuestFooter";
import UserHeader from "./components/Navigation/Header/UserHeader";
import UserFooter from "./components/Navigation/Footer/UserFooter";
import AdminFooter from "./components/Navigation/Footer/AdminFooter";
import AdminHeader from "./components/Navigation/Header/AdminHeader";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "../src/components/Auth/AdminRoute";

import LandingPage from "./pages/UnProtected_Routes/LandingPage";
import FoodStarch from "./components/UnProtected_Routes/FoodStarch";
import Product from "./components/UnProtected_Routes/Product";
import RetailInfo from "./components/UnProtected_Routes/RetailsInfo";


import GoogleCallback from "./components/Auth/GoogleCallback";

import Home from "./pages/Protected_Routes/User/Home";
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
import ProductUpdate from "./components/Protected_Routes/Admin/ProductUpdate";
import ProductView from "./components/Protected_Routes/Admin/ProductView";
import OrderList from "./pages/Protected_Routes/Admin/OrderList";
import AdminDashboard from "./pages/Protected_Routes/Admin/AdminDashboard";
import { useGetUserInfoQuery } from "./redux/api/usersApiSlice";

import ProductQuoteTable from "./components/UnProtected_Routes/Exports";
import LoginOptions from "./components/Auth/LoginOptions";
import Login from "./components/Auth/Phone/Login";
import Signup from "./components/Auth/Phone/Signup";
import ForgotPassword from "./components/Auth/Phone/ForgotPassword";
import IncoTermList from "./pages/Protected_Routes/Admin/IncoTermList";
import PortList from "./pages/Protected_Routes/Admin/PortList";
import DiscountList from "./pages/Protected_Routes/Admin/DiscountList";
import AboutUs from "./components/UnProtected_Routes/AboutUs";
import TermsAndConditions from "./components/UnProtected_Routes/TermsConditions";
import ContactUs from "./components/UnProtected_Routes/ContactUs";

const App = () => {

  const { data } = useGetUserInfoQuery();
 
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
    <BrowserRouter>
      {renderHeader()}
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/food-starch" element={<FoodStarch />} />
          <Route path="/wholesale" element={<Product />} />
          <Route path="/retail" element={<RetailInfo />} />
          <Route path="/exports" element={<ProductQuoteTable />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />

          <Route path="/login-options" element={<LoginOptions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/callback" element={<GoogleCallback />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/user-orders" element={<UserOrder />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="userlist" element={<UserList />} />
            <Route path="categorylist" element={<CategoryList />} />
            <Route path="incotermlist" element={<IncoTermList />} />
            <Route path="portlist" element={<PortList />} />
            <Route path="discount" element={<DiscountList />} />
            <Route path="create-product" element={<ProductList />} />
            <Route path="product/view/:id" element={<ProductView />} />
            <Route path="allproductslist" element={<AllProducts />} />
            <Route path="product/update/:id" element={<ProductUpdate />} />
            <Route path="orderlist" element={<OrderList />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
      <div id="footer">{renderFooter()}</div>
    </BrowserRouter>
  );
};

export default App;
