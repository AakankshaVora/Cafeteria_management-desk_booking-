# Cafeteria Management & Desk Booking System

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Quick Start
1. **Clone the repository** (if not already done)
2. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   You can adjust the values in `.env` if needed, but the defaults should work for a local Docker setup.

3. **Run the Application**
   Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **Database**: Exposed on port 5433 (mapped to localhost)

### Architecture
- **Frontend**: React (Vite) running in a Node.js container.
- **Backend**: Flask application running in a Python container.
- **Database**: PostgreSQL 13 running in its own container with data persistence via Docker volumes.

All services communicate via a shared Docker network `cafeteria_network`. The backend connects to the database using the service name `postgres`. The frontend connects to the backend using the environment variable `VITE_API_BASE_URL`.

### Stopping the Application
To stop the containers:
```bash
docker-compose down
```
To stop and remove volumes (clears database data):
```bash
docker-compose down -v
```
