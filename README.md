# SentraX

**A full-stack web application built with React, Spring Boot, and PostgreSQL.**

SentraX is a web application designed to provide a foundation for team-based collaboration and management. It uses a modern frontend, a Java backend, and a cloud-hosted relational database.

## 🌐 Live Demo

- **Application:** https://sentra-x.vercel.app
- **Backend API:** https://sentrax-backend-docker.onrender.com
- **Source Code:** https://github.com/keshavsundar10-KK/SentraX

## 📌 Project Overview

SentraX demonstrates full-stack web development by connecting a React frontend to a Spring Boot REST API backed by PostgreSQL.

The project includes account registration and login, backend API integration, database connectivity, and cloud deployment.

## ✨ Features

- **User Authentication:** Register a new account and log in.
- **Session Management:** Maintain user authentication through session cookies.
- **Frontend Application:** Responsive web interface built with React and Vite.
- **Backend API:** Java-based REST API built with Spring Boot.
- **Database Integration:** PostgreSQL database hosted on Neon.
- **Cloud Deployment:** Frontend hosted on Vercel and backend deployed on Render.
- **API Routing:** Frontend API requests are routed to the backend service.

*Add additional features, such as team creation or project management, after verifying that they are implemented and working.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| Tailwind CSS | UI styling |
| Java 21 | Backend programming language |
| Spring Boot | Backend framework and REST APIs |
| Spring Data JPA / Hibernate | Database persistence and ORM |
| PostgreSQL | Relational database |
| Neon | Cloud-hosted PostgreSQL |
| Maven | Backend dependency management and build |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Git and GitHub | Version control and source code hosting |

## 🏗️ Architecture

```text
User's Browser
      |
      v
React + Vite Frontend
      |
      v
Vercel Hosting
      |
      | /api/*
      v
Spring Boot REST API
      |
      v
Spring Data JPA / Hibernate
      |
      v
Neon PostgreSQL Database
```

## 📂 Project Structure

```text
SentraX/
├── sentrax-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vercel.json
│   └── ...
│
├── sentrax-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   ├── Dockerfile
│   └── ...
│
└── README.md
```

*The structure above is representative. Update it if your actual repository differs.*

## 🚀 Running the Project Locally

### Prerequisites

Install the following:

- Git
- Node.js and npm
- Java Development Kit (JDK) 21
- Maven, or use the Maven Wrapper if included
- Access to a PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/keshavsundar10-KK/SentraX.git
cd SentraX
```

### 2. Start the Backend

Open a terminal:

```bash
cd sentrax-backend
```

Configure the database connection and required environment variables before starting the backend.

Example for PowerShell:

```powershell
$env:DB_URL="YOUR_POSTGRESQL_JDBC_URL"
$env:DB_USER="YOUR_DATABASE_USERNAME"
$env:DATABASE_PASSWORD="YOUR_DATABASE_PASSWORD"
```

Start the application:

```powershell
.\mvnw.cmd spring-boot:run
```

If the Maven Wrapper is not present, use:

```powershell
mvn spring-boot:run
```

The backend normally starts at:

```text
http://localhost:8081
```

### 3. Start the Frontend

Open a second terminal:

```bash
cd sentrax-frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

```text
http://localhost:5173
```

Ensure the frontend API routing is configured for your local backend when developing locally.

## 🔐 Environment Variables

Configure these values in your local environment or deployment platform:

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USER` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `PORT` | Port assigned to the backend service |
| `COOKIE_SAMESITE` | Session cookie cross-site policy |
| `COOKIE_SECURE` | Whether cookies require HTTPS |
| `SHOW_SQL` | Enables or disables SQL logging |

**Security guidelines:**

- Never commit passwords, API keys, or session tokens to GitHub.
- Use environment variables or your hosting provider's secret settings.
- Use HTTPS in production.
- Use secure cookie settings appropriate for the deployment environment.
- Use a migration tool such as Flyway or Liquibase for controlled database schema changes as the project matures.

## ☁️ Deployment

### Frontend — Vercel

The React frontend is deployed to Vercel. The `vercel.json` configuration routes `/api/*` requests to the Render backend and serves the frontend application.

### Backend — Render

The Spring Boot backend is deployed on Render using Docker. Render provides the runtime port through the `PORT` environment variable.

### Database — Neon

The application uses a hosted PostgreSQL database on Neon. Database credentials are configured through environment variables.

**Note:** Free hosting services may experience cold starts after periods of inactivity, which can make the first request slower than subsequent requests.

## 🧪 Testing Checklist

Before releasing a new version, verify:

- [ ] A new user can register.
- [ ] An existing user can log in.
- [ ] Invalid credentials are handled appropriately.
- [ ] Unauthenticated users cannot access protected resources.
- [ ] Refreshing the page preserves the intended session behavior.
- [ ] Data is saved and retrieved correctly from PostgreSQL.
- [ ] Logout invalidates the session.
- [ ] Frontend API requests reach the deployed backend.
- [ ] The application works on desktop and mobile screens.
- [ ] No secrets are exposed in the repository or browser logs.

## 🔮 Future Improvements

Potential improvements include:

- Automated frontend and backend tests.
- Email verification and password reset.
- Role-based access control.
- Improved error handling and validation.
- API documentation using OpenAPI / Swagger.
- Database migrations and automated backups.
- CI/CD checks using GitHub Actions.
- Logging, monitoring, and performance improvements.
- Accessibility and responsive design enhancements.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Submit a pull request describing the changes.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before distributing the project under an open-source license.

## 👨‍💻 Author

**Keshav Sundar**

GitHub: https://github.com/keshavsundar10-KK
