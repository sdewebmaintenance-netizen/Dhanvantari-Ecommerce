import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Loader from "../../../components/Common/Loader";
import {
  useGetUserInfoQuery,
  useProfileMutation,
} from "../../../redux/api/usersApiSlice";
import { setCredentials } from "../../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/features/auth/authSlice";
import { apiSlice } from "../../../redux/api/apiSlice";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    GSTIN: "",
  });

  const { data: userInfo } = useGetUserInfoQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        GSTIN: userInfo.GSTIN || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        id: userInfo.id,
        ...formData,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  console.log("ailsad", userInfo);

  return (
    <div className="profile-content">
      <div className="profile-form-container">
        <h2 className="title text-animation">Update Profile</h2>
        <form onSubmit={submitHandler} className="profile-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter name"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="phone-input"
              inputClassName="form-control"
            />
          </div>

          {userInfo?.isAdmin ? (
            <div className="form-group">
              <label className="form-label">GSTIN (Optional)</label>
              <input
                type="text"
                name="GSTIN"
                placeholder="Enter GSTIN"
                className="form-control"
                value={formData.GSTIN}
                onChange={handleChange}
              />
            </div>
          ) : (
            <></>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-customized">
              Update
            </button>

            <Link to="/user-orders" className="btn-customized">
              My Orders
            </Link>
          </div>
          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
