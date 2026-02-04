# app/config.py

# -----------------------
# Database Configuration
# -----------------------
import os

# -----------------------
# Database Configuration
# -----------------------
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:newpassword123@localhost:5432/cafeteria_db")

# -----------------------
# Flask / App Security
# -----------------------
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")

# -----------------------
# JWT Configuration
# -----------------------
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-super-secret-key-change-this")
