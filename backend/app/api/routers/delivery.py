from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List

router = APIRouter()

class FeeRequest(BaseModel):
    postcode: str
    items: List[dict]

@router.post("/delivery/calculate")
def calc_fee(req: FeeRequest):
    # Simple placeholder: flat 49, free if 3+ items
    fee = 0 if len(req.items) >= 3 else 49
    return {"fee": fee}
