from app.app import create_app
from app.database import Base, engine

app = create_app()

def reset_db():
    with app.app_context():
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped.")
        
        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("All tables created.")

if __name__ == "__main__":
    reset_db()
