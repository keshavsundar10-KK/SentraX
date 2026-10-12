# SentraX

**A full-stack web application built with React, Spring Boot, and PostgreSQL.**

SentraX is a web application built using a modern frontend, a Java backend, and a cloud-hosted relational database. It demonstrates full-stack development, user authentication, database integration, and cloud deployment.

## 🌐 Live Demo

- **Live Application:** https://sentra-x.vercel.app
- **Backend Service:** https://sentrax-backend-docker.onrender.com
- **Source Code:** https://github.com/keshavsundar10-KK/SentraX

## 💡 Important: SentraX Is Live!

**SentraX is deployed and available to try.** 🚀

If you're visiting the application for the first time, or if it has been inactive for a while, signing up or logging in may take longer than usual.

The backend is hosted on Render's free tier. After a period of inactivity, the service may go to sleep and need time to start again. The backend may also need to establish a connection to the Neon PostgreSQL database.

**Please don't assume the application is broken just because the first request takes longer.**

### What should you do?

- Wait patiently while the server starts and processes your request.
- Avoid clicking the Login or Sign Up button repeatedly while a request is in progress.
- Once the backend is running, subsequent requests should generally be faster.
- If a request fails, wait briefly and try again. Persistent errors may indicate a problem that needs investigation.

Thank you for your patience and for trying SentraX!

## 📌 Project Overview

SentraX demonstrates how a frontend, backend, and database work together in a full-stack web application.

The project includes user registration and login, session-based authentication, REST API integration, PostgreSQL connectivity, and cloud deployment.

## ✨ Features

- **User Authentication:** Register an account and log in.
- **Session Management:** Maintain authentication using session cookies.
- **Frontend Interface:** Built with React and Vite.
- **Backend API:** REST API developed using Spring Boot.
- **Database Integration:** PostgreSQL hosted on Neon.
- **Cloud Deployment:** Frontend hosted on Vercel and backend deployed on Render.
- **API Routing:** Frontend API requests are routed to the backend service.

Additional features should be documented here as they are implemented and tested.

## 🛠️ Technology Stack

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
| Docker | Backend containerization |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Git and GitHub | Version control and source code hosting |

## 🏗️ Application Architecture

```text
                 User's Browser
                       |
                       v
               React + Vite Frontend
                       |
                       v
                 Vercel Hosting
                       |
                  /api/* requests
                       |
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

*This is a representative structure. The actual files may vary as the project evolves.*

## 🚀 Run SentraX Locally

### Prerequisites

Install the following software:

- Git
- Node.js and npm
- Java Development Kit (JDK) 21
- Maven, or the Maven Wrapper included in the repository
- Access to a PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/keshavsundar10-KK/SentraX.git
cd SentraX
```

### 2. Configure and start the backend

Open a terminal and navigate to the backend directory:

```powershell
cd sentrax-backend
```

Configure the database environment variables in PowerShell:

```powershell
$env:DB_URL="YOUR_POSTGRESQL_JDBC_URL"
$env:DB_USER="YOUR_DATABASE_USERNAME"
$env:DATABASE_PASSWORD="YOUR_DATABASE_PASSWORD"
```

Replace the example values with your own database credentials. Never commit real credentials to GitHub.

Start the backend using the Maven Wrapper if it is available:

```powershell
.\mvnw.cmd spring-boot:run
```

Otherwise, if Maven is installed:

```powershell
mvn spring-boot:run
```

The backend is configured to use port `8081` by default for local development.

### 3. Configure and start the frontend

Open a second terminal:

```powershell
cd sentrax-frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

http://localhost:5173

Make sure the frontend API configuration routes requests to your local backend during local development. The production API routing configuration may need a separate local-development setup.

## 🔐 Environment Variables

The backend uses environment variables for configuration.

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USER` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `PORT` | Port provided by the hosting platform |
| `COOKIE_SAMESITE` | Session cookie cross-site policy |
| `COOKIE_SECURE` | Whether cookies require HTTPS |
| `SHOW_SQL` | Enables or disables SQL logging |

### Security Best Practices

- Never commit database passwords, API keys, or session tokens.
- Store production secrets in Render's environment settings.
- Use HTTPS for production traffic.
- Configure session cookies securely for the deployment environment.
- Avoid sharing browser cookies or authorization headers in screenshots or logs.
- Consider using Flyway or Liquibase for database schema migrations as the project matures.

## ☁️ Deployment

### Frontend — Vercel

The React frontend is deployed on Vercel. The `vercel.json` configuration routes `/api/*` requests to the Render backend and serves the frontend application.

### Backend — Render

The Spring Boot backend is deployed on Render using Docker. The application reads the port assigned by Render through the `PORT` environment variable.

### Database — Neon

The application uses a PostgreSQL database hosted on Neon. Database connection details are supplied through environment variables.

### Hosting Considerations

On a free hosting tier, the backend may become inactive after a period without requests. When a new request arrives, the service may need to start up before processing it.

This can cause a delay during the first login or registration attempt after inactivity. It is a hosting limitation rather than proof that the application is broken. However, persistent errors should still be investigated.

## 🧪 Testing Checklist

Before releasing updates, verify the following:

- [ ] A new user can register successfully.
- [ ] An existing user can log in.
- [ ] Invalid credentials are handled appropriately.
- [ ] Protected resources require authentication.
- [ ] Session behavior remains correct after refreshing the page.
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
- Improved error handling and input validation.
- API documentation using OpenAPI / Swagger.
- Database migrations and automated backups.
- CI/CD checks using GitHub Actions.
- Logging, monitoring, and performance improvements.
- Accessibility and responsive design enhancements.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Submit a pull request describing your changes.

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute SentraX under an open-source license.

## 👨‍💻 Author

**Keshav Sundar**

GitHub: https://github.com/keshavsundar10-KK

---

Thank you for checking out SentraX! 🚀
