from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.db import get_db

router = APIRouter()

@router.get("/health")
def health(db: Session = Depends(get_db)):
    # Ping the DB — if this works, DB is reachable
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "db": True}
    except Exception:
        return {"status": "ok", "db": False}
