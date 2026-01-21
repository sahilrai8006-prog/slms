# SmartLMS

A production-ready Learning Management System built with React, Django, Docker, and Nginx.

## Architecture

- **Frontend**: React 18, Morning UI (White/Clean/Modern), deployed via Nginx.
- **Backend**: Django REST Framework, MySQL, JWT Auth.
- **Infrastructure**: Docker Compose, Nginx Reverse Proxy.
- **CI/CD**: Jenkins Pipeline.

## Directory Structure

- `frontend/`: React application.
- `backend/`: Django application.
- `nginx/`: Nginx configuration.
- `docker-compose.yml`: Deployment services.
- `Jenkinsfile`: CI/CD definition.

## Prerequisites

- Docker & Docker Compose
- Node.js (for local dev)
- Python 3.10+ (for local dev)

## Setup & Deployment

### 1. Clone the Repository
```bash
git clone <repo-url>
cd SmartLMS
```

### 2. Environment Variables
Ensure `docker-compose.yml` has the correct environment variables or use a `.env` file (currently set to defaults in yml for ease of use).

### 3. Build and Run with Docker
```bash
docker-compose up -d --build
```
This will start:
- MySQL (Port 3306)
- Backend (Port 8000)
- Frontend (Port 80 internal)
- Nginx (Port 80 exposed to host)

### 4. Access the Application
- **Web App**: http://localhost
- **API**: http://localhost/api/
- **Admin**: http://localhost/admin/

## Database Migrations (First Run)
After starting the containers, run migrations:
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Features
- **Roles**: Admin, Instructor, Student.
- **Courses**: Create, Edit, Enroll, View content.
- **Quizzes**: Take quizzes and view results.
- **Clean UI**: Modern "Morning" aesthetic.
