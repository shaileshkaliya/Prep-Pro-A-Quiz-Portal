# Prep Pro — Quiz Portal

Prep Pro is a full-stack quiz platform for creating, managing, and attempting quizzes. It uses a React frontend, a Java/Spring Boot microservices backend, an API gateway, service discovery, email services, and bulk data upload support.

## ✨ Features

- User registration and authentication
- Create and manage quizzes
- Add, edit, and organize quiz questions
- Attempt quizzes through a browser interface
- Track quiz entry and participation data
- Generate printable or downloadable quiz reports
- Send email notifications
- Upload quiz data in bulk
- Service discovery and API gateway-based routing
- Shell scripts for setup and service automation

## 📸 Screenshots

| Screenshot | Screenshot |
|---|---|
| ![Screenshot 1](./Screenshots/Screenshot%202025-04-21%20112744.png) | ![Screenshot 2](./Screenshots/Screenshot%202025-04-21%20112824.png) |
| ![Screenshot 3](./Screenshots/Screenshot%202025-04-21%20112846.png) | ![Screenshot 4](./Screenshots/Screenshot%202025-04-21%20112854.png) |
| ![Screenshot 5](./Screenshots/Screenshot%202025-04-21%20112914.png) | ![Screenshot 6](./Screenshots/Screenshot%202025-04-21%20112924.png) |
| ![Screenshot 7](./Screenshots/Screenshot%202025-04-21%20112944.png) | ![Screenshot 8](./Screenshots/Screenshot%202025-04-21%20112955.png) |
| ![Screenshot 9](./Screenshots/Screenshot%202025-04-21%20113006.png) | ![Screenshot 10](./Screenshots/Screenshot%202025-04-21%20113026.png) |
| ![Screenshot 11](./Screenshots/Screenshot%202025-04-21%20113036.png) | ![Screenshot 12](./Screenshots/Screenshot%202025-04-21%20113141.png) |
| ![Screenshot 13](./Screenshots/Screenshot%202025-04-21%20113331.png) | |

## 🏗️ Architecture

The project is divided into independent backend services and a React frontend:

| Component | Description |
|---|---|
| `client` | React + Vite web application |
| `APIGateway` | Central API gateway and routing entry point |
| `serviceRegistry` | Eureka service discovery server |
| `User` | User registration and account management |
| `quiz` | Quiz creation and management |
| `question` | Quiz question management |
| `qpfEntry` | Quiz participation and entry handling |
| `EmailService` | Email delivery and notifications |
| `BulkDataUpload` | Bulk quiz or question data upload support |
| `DBDesign` | Database design assets |
| `DummyData` | Sample data for development and testing |

The frontend communicates with backend services through the API gateway. Spring services register with Eureka for discovery and routing.

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite 5
- React Router
- Axios
- Tailwind CSS
- Chart.js
- React Toastify
- Font Awesome and Lucide icons
- jsPDF and html2canvas

### Backend

- Java 17
- Spring Boot
- Spring Cloud
- Spring Cloud Gateway
- Netflix Eureka
- Maven
- Lombok
- Spring Mail

### Supporting Tools

- Python automation scripts
- Bash scripts for installation and service management
- HTML/CSS/JavaScript

## 📋 Prerequisites

Install the following before running the project:

- Java 17 or newer
- Maven
- Node.js 18 or newer
- npm
- A supported SQL database
- Python 3
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shaileshkaliya/Prep-Pro-A-Quiz-Portal.git
cd Prep-Pro-A-Quiz-Portal
```

### 2. Configure database and environment values

Update `application.properties` or `application.yml` in each Spring service with:

- Database URL
- Database username
- Database password
- Eureka registry URL
- Email SMTP credentials
- Gateway routes

Do not commit real passwords or private credentials.

### 3. Start the backend services

Start the services in the following order:

```bash
# 1. Start the service registry
cd serviceRegistry
mvn spring-boot:run

# 2. Start the API gateway
cd ../APIGateway
mvn spring-boot:run

# 3. Start the remaining backend services
cd ../User && mvn spring-boot:run
cd ../quiz && mvn spring-boot:run
cd ../question && mvn spring-boot:run
cd ../qpfEntry && mvn spring-boot:run
cd ../EmailService && mvn spring-boot:run
cd ../BulkDataUpload && mvn spring-boot:run
```

Open separate terminals for each service.

### 4. Start the frontend

```bash
cd client
npm install
npm run dev
```

The Vite development server will print the local URL in the terminal, usually:

```text
http://localhost:5173
```

## 🧩 Automation Scripts

The repository includes helper scripts for installation, startup, shutdown, testing, and jar creation:

- `automate.sh`
- `automateOnHost.sh`
- `installtionUbuntu.sh`
- `start_services.py`
- `create-jars.sh`
- `stopOnHost.sh`
- `checkAPIs.sh`
- `uninstallation.sh`

Review scripts before executing them, because they may start services or modify system-level dependencies.

## 📁 Project Structure

```text
Prep-Pro-A-Quiz-Portal/
├── client/                 # React frontend
├── APIGateway/             # Spring Cloud API gateway
├── serviceRegistry/        # Eureka service discovery
├── User/                   # User service
├── quiz/                   # Quiz service
├── question/               # Question service
├── qpfEntry/               # Quiz entry service
├── EmailService/           # Email service
├── BulkDataUpload/         # Bulk upload service
├── DBDesign/               # Database design files
├── DummyData/              # Sample data
├── Screenshots/            # Application screenshots
├── *.sh                    # Setup and automation scripts
└── *.py                    # Python automation utilities
```

## 🧪 Development Commands

### Frontend

```bash
cd client
npm run dev      # Start development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

### Backend

```bash
mvn spring-boot:run
mvn clean package
mvn test
```

## 🔒 Security Notes

- Never commit database passwords, SMTP credentials, API keys, or JWT secrets.
- Add local secrets and credentials to environment-specific configuration files.
- Add those configuration files to `.gitignore` when they contain sensitive values.
- Validate and sanitize quiz uploads and user-generated content.

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push the branch and open a pull request.

## 📄 License

No license has been selected for this repository yet. Add a `LICENSE` file if you want to make the project's usage terms public.

## 👤 Author

**Shailesh Kaliya**

- GitHub: [@shaileshkaliya](https://github.com/shaileshkaliya)
