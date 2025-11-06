# Import all models here so they're registered with SQLAlchemy
from app.models.sale import Sale, SaleItem
from app.models.product import Product

__all__ = ['Sale', 'SaleItem', 'Product']
