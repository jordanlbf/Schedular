from fastapi import APIRouter, status
router = APIRouter()

@router.get("/customers/{customer_id}/validate", status_code=status.HTTP_200_OK)
def validate_customer(customer_id: str):
    return {"ok": True}
