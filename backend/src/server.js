const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 4000);
const DATA_FILE = path.join(__dirname, "..", "data", "db.json");
const FRONTEND_DIR = path.resolve(__dirname, "..", "..", "frontend");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

function readDb() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(4).toString("hex")}`;
}

function getAuthUser(req, db) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return db.users[0];
  const id = Buffer.from(token, "base64").toString("utf8").split(":")[0];
  return db.users.find(user => user.id === id) || db.users[0];
}

function validateRequired(body, fields) {
  const missing = fields.filter(field => !String(body[field] || "").trim());
  return missing.length ? `Missing required fields: ${missing.join(", ")}` : null;
}

function dashboard(db, user) {
  const ownProperties = db.properties.filter(property => property.ownerId === user.id);
  const openLegalCases = db.legalCases.filter(item => item.status !== "closed");
  const paidTotal = db.payments
    .filter(payment => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    user,
    metrics: {
      properties: ownProperties.length,
      activeAlerts: db.notifications.filter(item => !item.read).length,
      openLegalCases: openLegalCases.length,
      revenue: paidTotal
    },
    properties: ownProperties,
    legalCases: db.legalCases,
    appointments: db.appointments,
    reports: db.securityReports,
    payments: db.payments,
    notifications: db.notifications
  };
}

async function handleApi(req, res, pathname) {
  const db = readDb();
  const user = getAuthUser(req, db);

  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/v1/auth/login") {
    const body = await parseBody(req);
    const found = db.users.find(item => item.mobile === body.mobile || item.email === body.email) || db.users[0];
    const token = Buffer.from(`${found.id}:${Date.now()}`).toString("base64");
    return sendJson(res, 200, { token, user: found, message: "Login successful for demo mode." });
  }

  if (req.method === "GET" && pathname === "/api/v1/dashboard") {
    return sendJson(res, 200, dashboard(db, user));
  }

  if (req.method === "GET" && pathname === "/api/v1/properties") {
    return sendJson(res, 200, { data: db.properties });
  }

  if (req.method === "POST" && pathname === "/api/v1/properties") {
    const body = await parseBody(req);
    const error = validateRequired(body, ["name", "surveyNumber", "location", "area"]);
    if (error) return sendJson(res, 400, { error });
    const property = {
      id: makeId("prop"),
      ownerId: user.id,
      name: body.name,
      surveyNumber: body.surveyNumber,
      location: body.location,
      area: body.area,
      status: "verification_pending",
      risk: body.risk || "medium",
      documents: Number(body.documents || 0),
      lastVisit: null
    };
    db.properties.unshift(property);
    writeDb(db);
    return sendJson(res, 201, { data: property });
  }

  if (req.method === "POST" && pathname === "/api/v1/appointments") {
    const body = await parseBody(req);
    const error = validateRequired(body, ["service", "date", "slot"]);
    if (error) return sendJson(res, 400, { error });
    const appointment = {
      id: makeId("apt"),
      customerId: user.id,
      service: body.service,
      date: body.date,
      slot: body.slot,
      status: "confirmed"
    };
    db.appointments.unshift(appointment);
    writeDb(db);
    return sendJson(res, 201, { data: appointment });
  }

  if (req.method === "POST" && pathname === "/api/v1/legal-cases") {
    const body = await parseBody(req);
    const error = validateRequired(body, ["propertyId", "title"]);
    if (error) return sendJson(res, 400, { error });
    const legalCase = {
      id: makeId("case"),
      propertyId: body.propertyId,
      title: body.title,
      assignedTo: null,
      status: "new",
      priority: body.priority || "medium",
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    db.legalCases.unshift(legalCase);
    writeDb(db);
    return sendJson(res, 201, { data: legalCase });
  }

  if (req.method === "POST" && pathname === "/api/v1/support-tickets") {
    const body = await parseBody(req);
    const error = validateRequired(body, ["subject", "message"]);
    if (error) return sendJson(res, 400, { error });
    const ticket = {
      id: makeId("ticket"),
      customerId: user.id,
      subject: body.subject,
      message: body.message,
      status: "open",
      createdAt: new Date().toISOString()
    };
    db.supportTickets.unshift(ticket);
    writeDb(db);
    return sendJson(res, 201, { data: ticket });
  }

  return sendJson(res, 404, { error: "API route not found" });
}

function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(FRONTEND_DIR, safePath);

  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(FRONTEND_DIR, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          return res.end("Not found");
        }
        res.writeHead(200, { "Content-Type": contentTypes[".html"] });
        res.end(fallback);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Amara Lands app running at http://localhost:${PORT}`);
});
