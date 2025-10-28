from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DateTime, Numeric, ForeignKey
from datetime import datetime
from decimal import Decimal
from typing import List
from app.core.db import Base

class Sale(Base):
    __tablename__ = "sales"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_number: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    # JSON blobs as text for now (easy to evolve later)
    customer_json: Mapped[str] = mapped_column(Text)
    delivery_json: Mapped[str] = mapped_column(Text)
    payment_json:  Mapped[str] = mapped_column(Text)

    status: Mapped[str] = mapped_column(String(32), default="draft")

    subtotal: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)
    delivery_fee: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)
    discount: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    items: Mapped[List["SaleItem"]] = relationship(
        "SaleItem", back_populates="sale", cascade="all, delete-orphan", lazy="selectin"
    )

class SaleItem(Base):
    __tablename__ = "sale_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id", ondelete="CASCADE"), index=True)
    sku: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(255))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12,2))
    qty: Mapped[int] = mapped_column(Integer)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)

    sale: Mapped["Sale"] = relationship("Sale", back_populates="items")
