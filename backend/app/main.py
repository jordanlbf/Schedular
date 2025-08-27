from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Schedular API", version="0.1.0")

# Allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Event(BaseModel):
    id: int | None = None
    title: str
    starts_at: str
    ends_at: str
    description: str | None = None

DB: dict[int, Event] = {}
_counter = 1

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/events")
def list_events():
    return list(DB.values())

@app.post("/events", status_code=201)
def create_event(event: Event):
    global _counter
    event.id = _counter
    DB[_counter] = event
    _counter += 1
    return event