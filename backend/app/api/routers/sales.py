from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
import json
from app.core.db import get_db, Base, engine
from app.models.sale import Sale, SaleItem
from app.schemas.sale import SaleOrderCreate, SaleOrderRead, LineItemPayload, Totals

router = APIRouter()

def _get_next_order_number(db: Session) -> int:
    """Generate the next sequential order number"""
    max_order_number = db.query(func.max(Sale.order_number)).scalar()
    return (max_order_number or 0) + 1

def _decimal_to_float(obj):
    """Convert Decimal objects to float for JSON serialization"""
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: _decimal_to_float(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_decimal_to_float(item) for item in obj]
    return obj

def _calc_totals(items: list[SaleItem], discount_percent: Decimal, delivery_fee: Decimal) -> Totals:
    subtotal = sum((i.unit_price * i.qty for i in items), Decimal("0.00"))
    discount = (subtotal * (discount_percent or Decimal("0"))) / Decimal("100")
    total = subtotal + (delivery_fee or Decimal("0")) - discount
    return Totals(subtotal=subtotal, deliveryFee=delivery_fee, discount=discount, total=total)

def _sale_to_read(sale: Sale) -> SaleOrderRead:
    customer = json.loads(sale.customer_json)
    delivery = json.loads(sale.delivery_json)
    payment  = json.loads(sale.payment_json)
    items = [LineItemPayload(id=i.id, sku=i.sku, name=i.name, qty=i.qty, price=i.unit_price, color=i.color) for i in sale.items]
    totals = Totals(subtotal=sale.subtotal, deliveryFee=sale.delivery_fee, discount=sale.discount, total=sale.total)
    return SaleOrderRead(
        id=sale.id, orderNumber=sale.order_number, customer=customer, items=items, delivery=delivery, payment=payment,
        totals=totals, createdAt=sale.created_at.isoformat() + "Z", status=sale.status
    )

@router.post("/sales", response_model=SaleOrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: SaleOrderCreate, db: Session = Depends(get_db)):
    # Generate next sequential order number
    order_number = _get_next_order_number(db)
    
    # Convert payment data to dict and handle Decimal conversion
    payment_data = payload.payment.model_dump()
    payment_data_serializable = _decimal_to_float(payment_data)
    
    sale = Sale(
        order_number=order_number,
        customer_json=json.dumps(payload.customer.model_dump()),
        delivery_json=json.dumps(payload.delivery.model_dump()),
        payment_json=json.dumps(payment_data_serializable),
        status=payload.status or "draft",
    )
    sale.items = [
        SaleItem(sku=i.sku, name=i.name, unit_price=i.price, qty=i.qty, color=i.color) for i in payload.items
    ]
    # delivery fee and totals
    delivery_fee = payload.totals.deliveryFee if payload.totals else Decimal("0")
    discount_pct = payload.payment.discountPercent
    totals = _calc_totals(sale.items, discount_pct, delivery_fee)
    sale.subtotal, sale.delivery_fee, sale.discount, sale.total = totals.subtotal, totals.deliveryFee, totals.discount, totals.total

    db.add(sale)
    db.commit()
    db.refresh(sale)
    return _sale_to_read(sale)

@router.get("/sales/{order_id}", response_model=SaleOrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    sale = db.get(Sale, order_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return _sale_to_read(sale)

@router.patch("/sales/{order_id}", response_model=SaleOrderRead)
def update_order(order_id: int, updates: dict, db: Session = Depends(get_db)):
    sale = db.get(Sale, order_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Allow partial updates to customer, delivery, payment, items, status
    if "customer" in updates: sale.customer_json = json.dumps(updates["customer"])
    if "delivery" in updates: sale.delivery_json = json.dumps(updates["delivery"])
    if "payment" in updates:
        sale.payment_json = json.dumps(_decimal_to_float(updates["payment"]))
    if "status" in updates: sale.status = updates["status"]
    if "items" in updates:
        sale.items.clear()
        for i in updates["items"]:
            sale.items.append(SaleItem(sku=i["sku"], name=i["name"], unit_price=Decimal(str(i["price"])), qty=int(i["qty"]), color=i.get("color")))
    # Recalc totals
    payment = json.loads(sale.payment_json)
    discount_pct = Decimal(str(payment.get("discountPercent", 0)))
    delivery_fee = Decimal(str(updates.get("totals", {}).get("deliveryFee", sale.delivery_fee)))
    totals = _calc_totals(sale.items, discount_pct, delivery_fee)
    sale.subtotal, sale.delivery_fee, sale.discount, sale.total = totals.subtotal, totals.deliveryFee, totals.discount, totals.total

    db.commit()
    db.refresh(sale)
    return _sale_to_read(sale)

@router.post("/sales/{order_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    sale = db.get(Sale, order_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    sale.status = "cancelled"
    db.commit()
    return
