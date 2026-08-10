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
const userRoutes = require("./routes/userRoutes");
const securityReportRoutes = require("./routes/securityReportRoutes");
const fieldVisitRoutes = require("./routes/fieldVisitRoutes");
const geoTaggedReportRoutes = require("./routes/geoTaggedReportRoutes");
const surveillanceCameraRoutes = require("./routes/surveillanceCameraRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const patrolLogRoutes = require("./routes/patrolLogRoutes");
const faqRoutes = require("./routes/faqRoutes");
const liveChatRoutes = require("./routes/liveChatRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const caseTrackingRoutes = require("./routes/caseTrackingRoutes");
const adminUserRoutes = require("./routes/admin/userRoutes");
const adminPropertyRoutes = require("./routes/admin/propertyRoutes");


const app = express();

/* ------------------------- Middleware ------------------------- */

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* ---------------------- Static Uploads ------------------------ */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
console.log("Current directory:", __dirname);

const uploadPath = path.join(__dirname, "uploads");

console.log("Upload Path:", uploadPath);

app.use("/uploads", express.static(uploadPath));
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
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/case-tracking", caseTrackingRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
//app.use("/api/security-reports", securityReportRoutes);
app.use("/api/v1/field-visits", fieldVisitRoutes);
app.use("/api/v1/security-reports", securityReportRoutes);
app.use("/api/v1/geo-tagged-reports", geoTaggedReportRoutes);
app.use("/api/v1/patrol-logs", patrolLogRoutes);
app.use("/api/v1/surveillance-cameras", surveillanceCameraRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/faqs", faqRoutes);

app.use("/api/v1/live-chat", liveChatRoutes);
app.use("/api/v1/admin/properties", adminPropertyRoutes);


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