require("./config/db");
const http = require("http");
const { initSocket } = require("./socket");require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");



const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const propertyDocumentRoutes = require("./routes/propertyDocumentRoutes");
const legalRoutes = require("./routes/legalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

/* ------------------------- Middleware ------------------------- */

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* ---------------------- Static Uploads ------------------------ */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* --------------------------- Routes --------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Amara Lands API",
    version: "v1",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/property-documents", propertyDocumentRoutes);
app.use("/api/v1/legal", legalRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/notifications", notificationRoutes);


/* ------------------------- 404 Handler ------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

/* ---------------------- Global Error Handler ------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* --------------------------- Server ---------------------------- */

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});