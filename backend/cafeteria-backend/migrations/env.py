from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config, pool
from alembic import context

# --------------------------------------------------
# Add project root to PYTHONPATH
# --------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

# --------------------------------------------------
# Alembic Config object
# --------------------------------------------------
config = context.config

# --------------------------------------------------
# Logging configuration
# --------------------------------------------------
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --------------------------------------------------
# Import SQLAlchemy Base & DATABASE_URL
# --------------------------------------------------
from app.database import Base
from app.config import DATABASE_URL

# 👇 IMPORTANT: import ALL models so Alembic sees them
from app.models.desk import Desk
from app.models.desk_booking import DeskBooking
from app.models.user import User
from app.models.menu_item import MenuItem
from app.models.order import Order
from app.models.review import Review

# --------------------------------------------------
# Metadata for autogeneration
# --------------------------------------------------
target_metadata = Base.metadata

# --------------------------------------------------
# Set database URL dynamically
# --------------------------------------------------
config.set_main_option("sqlalchemy.url", DATABASE_URL)


# --------------------------------------------------
# Offline migrations
# --------------------------------------------------
def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# --------------------------------------------------
# Online migrations
# --------------------------------------------------
def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# --------------------------------------------------
# Decide offline vs online
# --------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
