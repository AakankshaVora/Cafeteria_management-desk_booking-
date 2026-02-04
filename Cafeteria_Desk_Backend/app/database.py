from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import DATABASE_URL


# Create database engine (now PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    echo=False   # shows SQL queries in terminal (very useful for debugging)
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()
