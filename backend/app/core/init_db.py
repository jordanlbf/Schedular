"""
Database initialization script for products table.

This script:
1. Creates the products table if it doesn't exist
2. Seeds sample product data from your catalog
3. Can be run multiple times safely (idempotent)

Run with:
    python app/core/init_db.py
Or from backend directory:
    python -c "from app.core.init_db import init_database; init_database()"
"""

from sqlalchemy.orm import Session
from app.core.db import engine, Base, SessionLocal
from app.models import Product
import json


def create_tables():
    """Create all tables defined in models"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")


def seed_sample_products(db: Session):
    """Add sample products from existing catalog"""
    
    # Check if products already exist
    existing_count = db.query(Product).count()
    if existing_count > 0:
        print(f"✓ Database already has {existing_count} products, skipping seed")
        return
    
    print("Seeding products from catalog...")
    
    # Products from frontend/src/features/sale/catalog.ts
    catalog_products = [
        {
            "sku": "DT-1001",
            "name": "Oak Dining Table",
            "price": 1999.00,
            "category": "Furniture",
            "image": "/images/products/oak-dining-table.png",
            "stock_status": "in-stock",
            "stock_quantity": 12,
            "lead_time_days": None,
            "lead_time_text": None,
            "colors_json": json.dumps([
                {"name": "Natural Oak", "value": "#C8956D", "inStock": True},
                {"name": "Dark Walnut", "value": "#4A2C17", "inStock": True}
            ]),
            "is_active": True
        },
        {
            "sku": "SF-2040",
            "name": "Leather Sofa",
            "price": 1499.00,
            "category": "Furniture",
            "image": "/images/products/leather-sofa-tan.png",
            "stock_status": "low-stock",
            "stock_quantity": 3,
            "lead_time_days": None,
            "lead_time_text": None,
            "colors_json": json.dumps([
                {"name": "Tan", "value": "#CD853F", "inStock": True, "image": "/images/products/leather-sofa-tan.png"},
                {"name": "Black", "value": "#1A1A1A", "inStock": True, "image": "/images/products/leather-sofa-black.png"}
            ]),
            "is_active": True
        },
        {
            "sku": "BS-3055",
            "name": "Bookshelf",
            "price": 799.00,
            "category": "Furniture",
            "image": "/images/products/bookshelf-walnut.png",
            "stock_status": "out-of-stock",
            "stock_quantity": 0,
            "lead_time_days": 14,
            "lead_time_text": "ETA: 2-3 Weeks",
            "colors_json": None,
            "is_active": True
        },
        {
            "sku": "CH-4110",
            "name": "Office Chair",
            "price": 399.00,
            "category": "Furniture",
            "image": "/images/products/office-chair.png",
            "stock_status": "in-stock",
            "stock_quantity": 28,
            "lead_time_days": None,
            "lead_time_text": None,
            "colors_json": json.dumps([
                {"name": "Black", "value": "#1C1C1C", "inStock": True},
                {"name": "Navy", "value": "#1B2951", "inStock": True}
            ]),
            "is_active": True
        },
        {
            "sku": "BD-5201",
            "name": "Queen Memory Foam Mattress",
            "price": 1299.00,
            "category": "Bedroom",
            "image": "/images/products/memory-foam-mattress.png",
            "stock_status": "out-of-stock",
            "stock_quantity": 0,
            "lead_time_days": 28,
            "lead_time_text": "ETA: 4-6 Weeks",
            "colors_json": None,
            "is_active": True
        },
        {
            "sku": "LT-6088",
            "name": "Modern Floor Lamp",
            "price": 249.00,
            "category": "Lighting",
            "image": "/images/products/modern-floor-lamp.png",
            "stock_status": "in-stock",
            "stock_quantity": 15,
            "lead_time_days": None,
            "lead_time_text": None,
            "colors_json": None,
            "is_active": True
        },
        {
            "sku": "CF-7134",
            "name": "Glass Coffee Table",
            "price": 649.00,
            "category": "Furniture",
            "image": "/images/products/glass-coffee-table.png",
            "stock_status": "low-stock",
            "stock_quantity": 2,
            "lead_time_days": None,
            "lead_time_text": None,
            "colors_json": None,
            "is_active": True
        },
        {
            "sku": "DR-8095",
            "name": "6-Drawer Dresser",
            "price": 899.00,
            "category": "Bedroom",
            "image": "/images/products/6-drawer-dresser.png",
            "stock_status": "discontinued",
            "stock_quantity": 0,
            "lead_time_days": None,
            "lead_time_text": "No Longer Available",
            "colors_json": json.dumps([
                {"name": "Arctic White", "value": "#F8F8FF", "inStock": False},
                {"name": "Dove Gray", "value": "#696969", "inStock": False}
            ]),
            "is_active": False  # Discontinued product
        }
    ]
    
    for product_data in catalog_products:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    print(f"✓ Seeded {len(catalog_products)} products from catalog")


def init_database():
    """Main initialization function"""
    print("\n" + "="*60)
    print("Initializing Schedular Database - Products")
    print("="*60 + "\n")
    
    try:
        # Create tables
        create_tables()
        
        # Seed data
        db = SessionLocal()
        try:
            seed_sample_products(db)
        finally:
            db.close()
        
        print("\n" + "="*60)
        print("✓ Database initialization complete!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ Error during initialization: {e}")
        raise


if __name__ == "__main__":
    init_database()
