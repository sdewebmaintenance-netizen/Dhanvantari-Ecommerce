import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRequestMessageMutation } from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";

const ContactUs = () => {
  const [requestMessage] = useRequestMessageMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData === 0) {
      toast.error("Please select at least one product");
      return;
    }

    try {
      setLoading(true);
      const result = await requestMessage(formData).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        toast.success("Message submitted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className="contact-container">
            <div className="contact-header">
              <h2 className="section-title">Contact Us</h2>
              <p className="section-subtitle">We'd love to hear from you</p>

              <div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-customized">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div>
                <div className="info-card">
                  <h3 className="title text-animation">Our Location</h3>
                  <p>
                    Ganesh Nagar, Puzhuthivakkam,
                    <br />
                    Madipakkam Chennai-600091
                    <br />
                    Tamil Nadu, India.
                    <br />
                    Supplier Location: Salem - Tamilnadu, Gujarat
                  </p>
                </div>

                <div className="info-card">
                  <h3 className="title text-animation">Contact Details</h3>
                  <p>
                    <strong>Phone:</strong> +91 99437 60055
                    <br />
                    <strong>Email:</strong> sales@sridhanvantariexports.com
                    <br />
                  </p>
                </div>

                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30774829.266167983!2d60.9692356005802!3d19.683097683425462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d5b61929c13%3A0x36f43987102ac50c!2sSri%20Dhanvantari%20Exports%20-%20Food%20Starch%20Supplier%20in%20India%20-%20Tapioca%20Starch%20%7C%20Corn%20Starch%20%7C%20Potato%20Starch!5e0!3m2!1sen!2som!4v1751370552188!5m2!1sen!2som"
                    width="600"
                    height="450"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="reviews-container">
            <h3 className="section-subtitle">What Our Customers Say</h3>
            <div
              class="elfsight-app-e731d262-b970-4d6b-bc27-1259b06b814c"
              data-elfsight-app-lazy
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ContactUs;
