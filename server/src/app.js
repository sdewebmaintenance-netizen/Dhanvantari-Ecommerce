const path = require("path");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const { uploadsDir, staticFileOptions } = require('./middlewares/multerConfiguration.js');

dotenv.config();

const morgan = require("morgan");
const cors = require("cors");
const { authentication } = require("./utils/jwt.js");

const { connect } = require("./config/prismaClient.config.js");
const passport = require("./config/passport.config.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const incotermRoutes = require("./routes/incoterm.routes.js");
const shippingAddressRoutes = require("./routes/shippingAddress.routes.js");
const portRoutes = require("./routes/port.routes.js");
const discountRoutes = require("./routes/discount.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const { PORT, CLIENT_URL, SECRET } = require("./config/configuration.js");

const DB_port = PORT || 5000;

const app = express();

connect();

app.use(morgan("dev"));

const corsOptions = {
  origin: `${CLIENT_URL}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use(express.json());
app.use(session({ secret: SECRET, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(uploadsDir, staticFileOptions));

app.use("/", authRoutes);

app.use(authentication);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/incoterm", incotermRoutes);
app.use("/api/port", portRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shippingAddress", shippingAddressRoutes);
app.use("/api/discount", discountRoutes);

app.listen(DB_port, () => {
  console.log(`✅ Server running on http://localhost:${DB_port}`);
});
