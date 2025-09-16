from fastapi import APIRouter
router = APIRouter()

@router.get("/products/{sku}/availability")
def product_availability(sku: str, quantity: int = 1):
    # TODO: wire real inventory later
    return {"available": True}
