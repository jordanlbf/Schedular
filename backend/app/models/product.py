from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Text, DateTime, Numeric, Boolean, Index
from datetime import datetime
from decimal import Decimal
from app.core.db import Base


class Product(Base):
    """
    Product model for catalog management.
    
    Products serve as the master catalog for items available for sale.
    When added to a sale, product data is copied to SaleItem for historical preservation.
    """
    __tablename__ = "products"
    
    # Primary identification
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    
    # Basic product information
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # Stock management
    stock_status: Mapped[str] = mapped_column(
        String(20), 
        default='in-stock',
        nullable=False,
        comment="in-stock, low-stock, out-of-stock, discontinued"
    )
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    lead_time_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    lead_time_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    # Colors stored as JSON string
    # Format: [{"name": "Red", "value": "#ff0000", "inStock": true, "image": "url"}]
    colors_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Soft delete and status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow, 
        nullable=False
    )
    
    # Indexes for common queries
    __table_args__ = (
        Index('idx_product_category_active', 'category', 'is_active'),
        Index('idx_product_stock_status', 'stock_status'),
    )
    
    def __repr__(self) -> str:
        return f"<Product(sku={self.sku}, name={self.name}, price={self.price})>"
