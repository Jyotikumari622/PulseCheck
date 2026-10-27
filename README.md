# PulseCheck — Website Uptime Monitoring Platform

PulseCheck is a full-stack website and API monitoring platform that automatically checks website availability every five minutes. It records HTTP status codes and response times, tracks uptime history, and sends email alerts when a monitored website goes down or recovers.

## Screenshots

![Dashboard](screenshots/dashboard.png)

![Site Detail](screenshots/site-detail.png)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts, React Router
- **Backend:** Node.js, Express.js, node-cron, Nodemailer
- **Database:** MongoDB Atlas
- **Authentication:** JWT and bcrypt
- **Deployment:** Netlify and Render

## Features

- User signup and login with JWT authentication and bcrypt password hashing.
- Add, view, and delete monitored websites.
- User-specific monitoring data.
- Automated website health checks every five minutes using `node-cron`.
- Track HTTP status codes, response times, and website availability.
- Calculate uptime percentages from monitoring history.
- Send email alerts only when a website's status changes from **Up to Down** or **Down to Up**.
- Visualize response-time history with Recharts.
- External scheduler integration through `/api/ping-check`, if configured, to help trigger monitoring checks on free-tier hosting.

## Project Structure

```text
PulseCheck/
├── backend/     # Express API and monitoring scheduler
├── frontend/    # React dashboard
└── screenshots/ # Application screenshots
```

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Gmail account with an App Password for email alerts

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure the required environment variables.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | A secure, random secret string |
| `EMAIL_USER` | Gmail address used to send alerts |
| `EMAIL_APP_PASSWORD` | Gmail App Password |

Run the backend using the appropriate script configured in `backend/package.json`, for example:

```bash
npm run dev
```

### 2. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` and ensure `VITE_API_URL` points to your local backend API.

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## How It Works

1. Users add websites to monitor through the dashboard.
2. A scheduled background job checks monitored websites every five minutes.
3. Each check records the website's status, HTTP response code, and response time.
4. Monitoring history is stored, with the latest 100 checks retained per website.
5. Email alerts are triggered when a website transitions between Up and Down states, avoiding repeated alerts for the same ongoing failure.
6. The dashboard periodically fetches updated data and displays website status and response-time history.

## Deployment

- **Database:** MongoDB Atlas
- **Backend:** Render — root directory `backend`, build command `npm install`, start command `npm start`
- **Frontend:** Netlify — root directory `frontend`, build command `npm run build`, publish directory `dist`

Configure environment variables through the respective hosting dashboards. Never commit `.env` files or expose credentials in the repository.

## Hosting Considerations

On Render's free tier, the backend may sleep after a period of inactivity. Since `node-cron` runs inside the backend process, scheduled checks may be delayed while the service is inactive.

An external scheduler may help trigger checks, provided the `/api/ping-check` endpoint is implemented and appropriately secured.

## Resume Description

**PulseCheck — Website Uptime Monitoring Platform | MERN Stack, Cloud & DevOps**

Developed a full-stack website monitoring platform featuring JWT authentication, scheduled health checks, HTTP status and response-time tracking, uptime history, and transition-based email alerts. Integrated React, Node.js, Express.js, and MongoDB Atlas, with frontend and backend deployment using Netlify and Render.
