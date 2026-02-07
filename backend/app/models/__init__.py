from sqlalchemy import create_engine, Column, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(String, primary_key=True, index=True)
    media_type = Column(String)  # 'image' or 'video'
    filename = Column(String)
    media_hash = Column(String, unique=True)
    detection_score = Column(Float)
    is_ai_generated = Column(Boolean)
    report_path = Column(String)
    blockchain_tx = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database engine
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cybershield.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
