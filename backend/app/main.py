# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import Base, engine
from app.api.routers import sales, products, delivery, customers

app = FastAPI(title="Schedular API", version="0.1.0")

# CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary (needed until Alembic/migrations are added)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# Routers that your frontend calls (base URL = /api)
app.include_router(sales.router,     prefix="/api")
app.include_router(products.router,  prefix="/api")
app.include_router(delivery.router,  prefix="/api")
app.include_router(customers.router, prefix="/api")
