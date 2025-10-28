from typing import List, Optional, Literal
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

PaymentMethod = Literal['cash','card','transfer','layby']

class LineItemPayload(BaseModel):
    id: Optional[int] = None
    sku: str
    name: str
    qty: int = Field(..., ge=1)
    price: Decimal = Field(..., ge=0)
    color: Optional[str] = None

class Address(BaseModel):
    unit: Optional[str] = None
    street: str
    street2: Optional[str] = None
    city: str
    state: str
    zip: str
    notes: Optional[str] = None

class SecondPerson(BaseModel):
    firstName: str
    lastName: str
    phone: Optional[str] = None
    email: Optional[str] = None
    relationship: Optional[str] = None

class Customer(BaseModel):
    firstName: str
    lastName: str
    name: Optional[str] = None
    phone: str
    email: str
    additionalPhone: Optional[str] = None
    secondPerson: Optional[SecondPerson] = None
    billingAddress: Optional[Address] = None
    deliveryAddress: Optional[Address] = None
    sameAsDelivery: Optional[bool] = None

class DeliveryDetails(BaseModel):
    preferredDate: str
    timeSlot: str
    specialInstructions: str
    whiteGloveService: bool
    oldMattressRemoval: bool
    setupService: bool

class Payment(BaseModel):
    method: PaymentMethod
    depositAmount: Decimal = Field(0, ge=0)
    discountPercent: Decimal = Field(0, ge=0)

class Totals(BaseModel):
    subtotal: Decimal = Field(0, ge=0)
    deliveryFee: Decimal = Field(0, ge=0)
    discount: Decimal = Field(0, ge=0)
    total: Decimal = Field(0, ge=0)

class SaleOrderCreate(BaseModel):
    customer: Customer
    items: List[LineItemPayload]
    delivery: DeliveryDetails
    payment: Payment
    totals: Optional[Totals] = None   # server will compute if missing
    status: Optional[str] = "draft"

class SaleOrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    orderNumber: int
    customer: Customer
    items: List[LineItemPayload]
    delivery: DeliveryDetails
    payment: Payment
    totals: Totals
    createdAt: str
    status: str
