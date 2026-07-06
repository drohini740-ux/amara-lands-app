# Amara Lands Web Application Starter

This is a runnable starter implementation based on the Amara Lands application requirement document.

## What is included

- Customer dashboard
- Property management
- Legal case requests
- Appointment booking
- Payment overview
- Notifications
- Support ticket creation
- Backend REST API
- JSON demo database

## Project structure

```text
amara-lands-app/
  backend/
    src/server.js
    data/db.json
    package.json
  frontend/
    index.html
    styles.css
    app.js
```

## How to run

Open a terminal in:

```text
outputs/amara-lands-app/backend
```

Start the app:

```bash
npm start
```

Then open:

```text
http://localhost:4000
```

## API routes

```text
POST /api/v1/auth/login
GET  /api/v1/dashboard
GET  /api/v1/properties
POST /api/v1/properties
POST /api/v1/appointments
POST /api/v1/legal-cases
POST /api/v1/support-tickets
```

## Notes for production

This starter uses Node.js built-in modules and a JSON file database so it can run without installing packages. For production, replace the JSON storage with PostgreSQL, add JWT verification, connect Razorpay/Firebase/AWS S3, and move sensitive settings into environment variables.
