# Export all schemas for easy imports
from app.schemas.sale import *
from app.schemas.job import *
from app.schemas.product import (
    ProductRead,
    ProductCreate,
    ProductUpdate,
    ProductList,
    StockInfo,
    ColorOption,
    AvailabilityCheck
)

__all__ = [
    'ProductRead',
    'ProductCreate', 
    'ProductUpdate',
    'ProductList',
    'StockInfo',
    'ColorOption',
    'AvailabilityCheck'
]
