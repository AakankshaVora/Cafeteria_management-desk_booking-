import pytest
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from app.app import create_app
from app.database import Base
from app.models.user import User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

TEST_DATABASE_URL = "postgresql://postgres:newpassword123@localhost:5432/test_cafeteria_db"

@pytest.fixture(scope='session')
def engine():
    return create_engine(TEST_DATABASE_URL)

@pytest.fixture(scope='session')
def tables(engine):
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope='session')
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": TEST_DATABASE_URL,
        "JWT_SECRET_KEY": "test-secret"
    })
    return app

@pytest.fixture(scope='function')
def db_session(engine, tables):
    """Creates a new database session for a test with rollback."""
    connection = engine.connect()
    transaction = connection.begin()
    
    session_factory = sessionmaker(bind=connection)
    session = scoped_session(session_factory)
    
    yield session
    
    session.remove()
    transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True)
def patch_db_session(monkeypatch, db_session):
    """Patch SessionLocal to return the shared db_session."""
    
    # Proxy class to intercept close/commit
    class SharedSession:
        def __init__(self):
            pass
        
        def __getattr__(self, name):
            return getattr(db_session, name)
            
        def close(self):
            # Do nothing! Let fixture handle cleanup
            pass
            
        def commit(self):
            # Flush instead of commit to keep transaction open?
            # Or assume app commit is fine within the transaction?
            # If app calls commit(), it commits the transaction on the connection.
            # This would persist data.
            # We want to Avoid persisting data.
            # So we flush to make it visible to subsequent queries in same transaction?
            db_session.flush()
            # But DO NOT call db_session.commit() because that commits the transaction 
            # (unless using subtransactions/nested savepoints).
            pass
            
        def convert_to_model(self, obj):
             # Helper for tests if needed
             pass

    # Factory that returns the proxy
    def SessionLocalOverride():
        return SharedSession()

    # Patch modules
    monkeypatch.setattr("app.database.SessionLocal", SessionLocalOverride)
    
    route_modules = [
        "app.routes.auth",
        "app.routes.menu",
        "app.routes.orders",
        "app.routes.desks",
        "app.routes.desk_booking",
        "app.routes.reviews",
        "app.routes.dashboard",
        "app.routes.protected"
    ]
    
    for module_name in route_modules:
        if module_name in sys.modules and hasattr(sys.modules[module_name], "SessionLocal"):
            monkeypatch.setattr(f"{module_name}.SessionLocal", SessionLocalOverride)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_users(db_session):
    """Create basic users for testing."""
    users = {
        "employee": User(name="Test Emp", email="emp@test.com", password_hash=generate_password_hash("password", method='pbkdf2:sha256'), role="employee"),
        "cafeteria": User(name="Test Cafe", email="cafe@test.com", password_hash=generate_password_hash("password", method='pbkdf2:sha256'), role="cafeteria_admin"),
        "desk": User(name="Test Desk", email="desk@test.com", password_hash=generate_password_hash("password", method='pbkdf2:sha256'), role="desk_admin")
    }
    
    for u in users.values():
        db_session.add(u)
    # Don't commit if we are capturing commit() calls? 
    # But we need basic data to be flushed.
    db_session.flush()
    # If we don't commit, 'db_session' has pending changes.
    # The SharedSession sees them because it is the SAME session.
    # So this is fine.
    # But if code uses raw SQL (rare), might need flush.
    return users

@pytest.fixture
def auth_headers(test_users):
    def _get_headers(role):
        user = test_users[role]
        # Ensure user.id is available (flush ensured it)
        token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return {"Authorization": f"Bearer {token}"}
    return _get_headers
