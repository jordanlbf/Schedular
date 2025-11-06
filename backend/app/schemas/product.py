from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# Nested models
class ColorOption(BaseModel):
    """Color variant for a product"""
    name: str = Field(..., min_length=1, max_length=50, description="Color name (e.g., 'Red')")
    value: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$', description="Hex color code (e.g., '#ff0000')")
    inStock: Optional[bool] = Field(default=True, description="Whether this color is available")
    image: Optional[str] = Field(default=None, max_length=500, description="Color-specific product image URL")

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Red",
                "value": "#ff0000",
                "inStock": True,
                "image": "https://example.com/product-red.jpg"
            }
        }
    }


class StockInfo(BaseModel):
    """Stock availability information"""
    status: str = Field(..., pattern=r'^(in-stock|low-stock|out-of-stock|discontinued)$')
    quantity: int = Field(..., ge=0, description="Current stock quantity")
    leadTimeDays: Optional[int] = Field(default=None, ge=0, description="Lead time in days for out-of-stock items")
    leadTimeText: Optional[str] = Field(default=None, max_length=100, description="Human-readable lead time")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "in-stock",
                "quantity": 50,
                "leadTimeDays": None,
                "leadTimeText": None
            }
        }
    }


# Main Product schemas
class ProductBase(BaseModel):
    """Base product fields shared across schemas"""
    sku: str = Field(..., min_length=1, max_length=100, description="Stock Keeping Unit (unique identifier)")
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    price: Decimal = Field(..., ge=0, decimal_places=2, description="Product price")
    category: Optional[str] = Field(default=None, max_length=100, description="Product category")
    image: Optional[str] = Field(default=None, max_length=500, description="Product image URL")


class ProductCreate(ProductBase):
    """Schema for creating a new product"""
    stock_status: str = Field(
        default='in-stock',
        pattern=r'^(in-stock|low-stock|out-of-stock|discontinued)$',
        description="Stock availability status"
    )
    stock_quantity: int = Field(default=0, ge=0, description="Current stock quantity")
    lead_time_days: Optional[int] = Field(default=None, ge=0, description="Lead time in days")
    lead_time_text: Optional[str] = Field(default=None, max_length=100, description="Human-readable lead time")
    colors: Optional[List[ColorOption]] = Field(default=None, description="Available color options")
    is_active: bool = Field(default=True, description="Whether product is active in catalog")

    model_config = {
        "json_schema_extra": {
            "example": {
                "sku": "DT-1001",
                "name": "Oak Dining Table",
                "price": 1999.00,
                "category": "Furniture",
                "image": "/images/products/oak-dining-table.png",
                "stock_status": "in-stock",
                "stock_quantity": 12,
                "lead_time_days": None,
                "lead_time_text": None,
                "colors": [
                    {"name": "Natural Oak", "value": "#C8956D", "inStock": True},
                    {"name": "Dark Walnut", "value": "#4A2C17", "inStock": True}
                ],
                "is_active": True
            }
        }
    }


class ProductUpdate(BaseModel):
    """Schema for updating a product (all fields optional)"""
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    price: Optional[Decimal] = Field(default=None, ge=0, decimal_places=2)
    category: Optional[str] = Field(default=None, max_length=100)
    image: Optional[str] = Field(default=None, max_length=500)
    stock_status: Optional[str] = Field(
        default=None,
        pattern=r'^(in-stock|low-stock|out-of-stock|discontinued)$'
    )
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    lead_time_days: Optional[int] = Field(default=None, ge=0)
    lead_time_text: Optional[str] = Field(default=None, max_length=100)
    colors: Optional[List[ColorOption]] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)

    model_config = {
        "json_schema_extra": {
            "example": {
                "price": 1899.00,
                "stock_quantity": 10,
                "stock_status": "low-stock"
            }
        }
    }


class ProductRead(BaseModel):
    """
    Schema for reading a product.
    Matches frontend Product interface exactly.
    """
    # Override price to be float for JSON serialization (frontend expects number, not Decimal)
    sku: str = Field(..., min_length=1, max_length=100, description="Stock Keeping Unit (unique identifier)")
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    price: float = Field(..., ge=0, description="Product price as float for JSON")
    category: Optional[str] = Field(default=None, max_length=100, description="Product category")
    image: Optional[str] = Field(default=None, max_length=500, description="Product image URL")
    stock: StockInfo
    colors: Optional[List[ColorOption]] = None
    
    # Admin fields (only included when include_admin_fields=True in router)
    id: Optional[int] = None
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "sku": "DT-1001",
                "name": "Oak Dining Table",
                "price": 1999.00,
                "category": "Furniture",
                "image": "/images/products/oak-dining-table.png",
                "stock": {
                    "status": "in-stock",
                    "quantity": 12,
                    "leadTimeDays": None,
                    "leadTimeText": None
                },
                "colors": [
                    {"name": "Natural Oak", "value": "#C8956D", "inStock": True},
                    {"name": "Dark Walnut", "value": "#4A2C17", "inStock": True}
                ]
            }
        }
    }


class ProductList(BaseModel):
    """Paginated product list response"""
    items: List[ProductRead]
    total: int = Field(..., ge=0, description="Total number of products matching filters")
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Items per page")
    has_more: bool = Field(..., description="Whether more pages are available")

    model_config = {
        "json_schema_extra": {
            "example": {
                "items": [
                    {
                        "sku": "DT-1001",
                        "name": "Oak Dining Table",
                        "price": 1999.00,
                        "category": "Furniture",
                        "stock": {"status": "in-stock", "quantity": 12}
                    }
                ],
                "total": 8,
                "page": 1,
                "page_size": 50,
                "has_more": False
            }
        }
    }


class AvailabilityCheck(BaseModel):
    """Product availability check response"""
    available: bool = Field(..., description="Whether product is available in requested quantity")
    inStock: Optional[int] = Field(default=None, ge=0, description="Current stock quantity")
    requested: Optional[int] = Field(default=None, ge=1, description="Requested quantity")
    reason: Optional[str] = Field(default=None, description="Reason if not available")
    leadTime: Optional[str] = Field(default=None, description="Lead time if out of stock")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "available": True,
                    "inStock": 12,
                    "requested": 5,
                    "reason": None,
                    "leadTime": None
                },
                {
                    "available": False,
                    "inStock": 2,
                    "requested": 5,
                    "reason": "Insufficient stock",
                    "leadTime": None
                },
                {
                    "available": False,
                    "inStock": 0,
                    "requested": 1,
                    "reason": "Out of stock",
                    "leadTime": "2-3 weeks"
                }
            ]
        }
    }
