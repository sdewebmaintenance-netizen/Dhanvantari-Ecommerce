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
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./pages/Admin/AdminRoute";

import LandingPage from "./pages/LandingPage";
import GoogleCallback from "./pages/Auth/GoogleCallback";

import Home from "./pages/Home";
import Favorites from "./pages/Products/Favorites";
import ProductDetails from "./pages/Products/ProductDetails";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Profile from "./pages/User/Profile";
import Shipping from "./pages/Orders/Shipping";
import PlaceOrder from "./pages/Orders/PlaceOrder";
import Order from "./pages/Orders/Order";

import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";
import OrderList from "./pages/Admin/OrderList";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App = () => {
  const IsAdmin = localStorage.getItem("isAdmin");
  const renderHeader = () => {
    if (!IsAdmin) {
      return <GuestHeader />;
    } else if (IsAdmin === true) {
      return <AdminHeader />;
    } else {
      return <UserHeader />;
    }
  };

  const renderFooter = () => {
    if (!IsAdmin) {
      return <GuestFooter />;
    } else if (IsAdmin === true) {
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
