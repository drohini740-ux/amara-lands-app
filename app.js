const API_BASE = "http://localhost:4000";
let state = {
  token: localStorage.getItem("amaraToken") || "",
  dashboard: null
};

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav button");
const pageTitle = document.querySelector("#pageTitle");
const userName = document.querySelector("#userName");
const toast = document.querySelector("#toast");

function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function labelStatus(value) {
  return String(value || "").replaceAll("_", " ");
}

function riskClass(risk) {
  if (risk === "high" || risk === "urgent") return "danger";
  if (risk === "medium") return "warn";
  return "good";
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: state.token ? `Bearer ${state.token}` : "",
      ...(options.headers || {})
    }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Something went wrong");
  }
  return payload;
}

async function ensureLogin() {
  if (state.token) return;
  const payload = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ mobile: "9876543210", otp: "123456" })
  });
  state.token = payload.token;
  localStorage.setItem("amaraToken", payload.token);
}

async function loadDashboard() {
  await ensureLogin();
  state.dashboard = await request("/api/v1/dashboard");
  render();
}

function renderMetrics(metrics) {
  const items = [
    ["Properties", metrics.properties],
    ["Open legal cases", metrics.openLegalCases],
    ["Unread alerts", metrics.activeAlerts],
    ["Revenue", money(metrics.revenue)]
  ];
  document.querySelector("#metrics").innerHTML = items
    .map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderProperties(properties) {
  document.querySelector("#propertiesList").innerHTML = properties
    .map(
      property => `
        <article class="property-card">
          <div>
            <h3>${property.name}</h3>
            <p>${property.location}</p>
          </div>
          <div class="chips">
            <span class="chip">${property.surveyNumber}</span>
            <span class="chip">${property.area}</span>
            <span class="chip ${property.status === "verified" ? "good" : "warn"}">${labelStatus(property.status)}</span>
            <span class="chip ${riskClass(property.risk)}">${property.risk} risk</span>
          </div>
          <span>${property.documents} documents uploaded</span>
        </article>
      `
    )
    .join("");
}

function renderList(selector, items, emptyText, template) {
  document.querySelector(selector).innerHTML = items.length
    ? items.map(template).join("")
    : `<article class="list-item"><strong>${emptyText}</strong><span>New records will appear here.</span></article>`;
}

function renderLegalSelect(properties) {
  document.querySelector("#legalPropertySelect").innerHTML = properties
    .map(property => `<option value="${property.id}">${property.name}</option>`)
    .join("");
}

function render() {
  const data = state.dashboard;
  if (!data) return;
  userName.textContent = data.user.name;
  renderMetrics(data.metrics);
  renderProperties(data.properties);
  renderLegalSelect(data.properties);
  renderList("#reportsList", data.reports, "No reports yet", report => `
    <article class="list-item">
      <strong>${report.type}</strong>
      <span>${report.summary}</span>
      <span>${new Date(report.createdAt).toLocaleString()}</span>
    </article>
  `);
  renderList("#notificationsList", data.notifications, "No notifications", item => `
    <article class="list-item">
      <strong>${item.title}</strong>
      <span>${item.message}</span>
    </article>
  `);
  renderList("#legalCasesList", data.legalCases, "No legal cases", item => `
    <article class="list-item">
      <strong>${item.title}</strong>
      <span>Status: ${labelStatus(item.status)} | Priority: ${item.priority}</span>
      <span>Updated ${item.updatedAt}</span>
    </article>
  `);
  renderList("#appointmentsList", data.appointments, "No appointments", item => `
    <article class="list-item">
      <strong>${item.service}</strong>
      <span>${item.date} at ${item.slot}</span>
      <span>Status: ${item.status}</span>
    </article>
  `);
  renderList("#paymentsList", data.payments, "No payments", item => `
    <article class="list-item">
      <strong>${item.plan}</strong>
      <span>${money(item.amount)} | ${item.status}</span>
      <span>Paid on ${item.paidAt}</span>
    </article>
  `);
}

function switchView(id) {
  views.forEach(view => view.classList.toggle("active", view.id === id));
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === id));
  pageTitle.textContent = document.querySelector(`[data-view="${id}"]`).textContent;
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function attachForm(id, path, successMessage) {
  document.querySelector(id).addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await request(path, {
        method: "POST",
        body: JSON.stringify(formData(event.currentTarget))
      });
      event.currentTarget.reset();
      await loadDashboard();
      showToast(successMessage);
    } catch (error) {
      showToast(error.message);
    }
  });
}

navButtons.forEach(button => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelector("#refreshBtn").addEventListener("click", async () => {
  await loadDashboard();
  showToast("Dashboard refreshed");
});

attachForm("#propertyForm", "/api/v1/properties", "Property created and sent for verification");
attachForm("#legalForm", "/api/v1/legal-cases", "Legal request submitted");
attachForm("#appointmentForm", "/api/v1/appointments", "Appointment booked");
attachForm("#supportForm", "/api/v1/support-tickets", "Support ticket created");

loadDashboard().catch(error => showToast(error.message));
