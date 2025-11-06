from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import json
from decimal import Decimal

from app.core.db import get_db
from app.models.product import Product
from app.schemas.product import (
    ProductRead, 
    ProductCreate, 
    ProductUpdate,
    ProductList,
    StockInfo, 
    ColorOption,
    AvailabilityCheck
)

router = APIRouter()

def _product_to_read(product: Product, include_admin_fields: bool = False) -> ProductRead:
    """
    Convert database Product to ProductRead schema.
    
    Args:
        product: SQLAlchemy Product instance
        include_admin_fields: Include id, is_active, timestamps for admin views
    
    Returns:
        ProductRead schema matching frontend Product interface
    """
    # Parse colors from JSON
    colors = None
    if product.colors_json:
        try:
            colors_data = json.loads(product.colors_json)
            colors = [ColorOption(**c) for c in colors_data]
        except (json.JSONDecodeError, TypeError):
            # Log error in production
            colors = None
    
    # Build stock info
    stock = StockInfo(
        status=product.stock_status,
        quantity=product.stock_quantity,
        leadTimeDays=product.lead_time_days,
        leadTimeText=product.lead_time_text
    )
    
    # Build response
    product_data = {
        'sku': product.sku,
        'name': product.name,
        'price': float(product.price),  # Convert Decimal to float for JSON
        'category': product.category,
        'image': product.image,
        'stock': stock,
        'colors': colors
    }
    
    # Include admin fields if requested
    if include_admin_fields:
        product_data.update({
            'id': product.id,
            'is_active': product.is_active,
            'created_at': product.created_at,
            'updated_at': product.updated_at
        })
    
    return ProductRead(**product_data)


@router.get("/products", response_model=List[ProductRead])
def get_products(
    active_only: bool = Query(True, description="Filter to only active products"),
    category: Optional[str] = Query(None, description="Filter by category"),
    in_stock_only: bool = Query(False, description="Filter to only in-stock items"),
    search: Optional[str] = Query(None, min_length=1, description="Search by name or SKU"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Get all products with optional filtering, search, and pagination.
    
    Query parameters:
    - active_only: Show only active products (default: true)
    - category: Filter by category
    - in_stock_only: Show only products with stock_status='in-stock'
    - search: Search in product name or SKU (case-insensitive)
    - skip: Pagination offset
    - limit: Page size (max 1000)
    
    Returns:
        List of products matching the filters
    """
    query = db.query(Product)
    
    # Apply filters
    if active_only:
        query = query.filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category == category)
    
    if in_stock_only:
        query = query.filter(Product.stock_status == 'in-stock')
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.sku.ilike(search_pattern)
            )
        )
    
    # Order by name for consistent results
    query = query.order_by(Product.name)
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    
    return [_product_to_read(p) for p in products]


@router.get("/products/paginated", response_model=ProductList)
def get_products_paginated(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    active_only: bool = Query(True, description="Filter to only active products"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, min_length=1, description="Search by name or SKU"),
    db: Session = Depends(get_db)
):
    """
    Get paginated products with metadata.
    
    Returns paginated results with total count and pagination metadata.
    """
    query = db.query(Product)
    
    # Apply filters (same as above)
    if active_only:
        query = query.filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category == category)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.sku.ilike(search_pattern)
            )
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    skip = (page - 1) * page_size
    products = query.order_by(Product.name).offset(skip).limit(page_size).all()
    
    return ProductList(
        items=[_product_to_read(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        has_more=(skip + len(products)) < total
    )


@router.get("/products/{sku}", response_model=ProductRead)
def get_product(
    sku: str,
    include_inactive: bool = Query(False, description="Include inactive products"),
    db: Session = Depends(get_db)
):
    """
    Get a single product by SKU.
    
    Args:
        sku: Product SKU
        include_inactive: Allow retrieving inactive products
    
    Returns:
        Product details
    
    Raises:
        404: Product not found
    """
    query = db.query(Product).filter(Product.sku == sku)
    
    if not include_inactive:
        query = query.filter(Product.is_active == True)
    
    product = query.first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with SKU '{sku}' not found"
        )
    
    return _product_to_read(product)


@router.get("/products/{sku}/availability", response_model=AvailabilityCheck)
def check_product_availability(
    sku: str,
    quantity: int = Query(1, ge=1, description="Requested quantity"),
    db: Session = Depends(get_db)
):
    """
    Check if a product is available in the requested quantity.
    
    Args:
        sku: Product SKU
        quantity: Requested quantity
    
    Returns:
        Availability status with details
    """
    product = db.query(Product).filter(
        Product.sku == sku,
        Product.is_active == True
    ).first()
    
    if not product:
        return AvailabilityCheck(
            available=False,
            reason="Product not found"
        )
    
    # Check stock status
    if product.stock_status == 'discontinued':
        return AvailabilityCheck(
            available=False,
            reason="Product discontinued",
            leadTime=product.lead_time_text
        )
    
    if product.stock_status == 'out-of-stock':
        return AvailabilityCheck(
            available=False,
            reason="Out of stock",
            leadTime=product.lead_time_text,
            inStock=0,
            requested=quantity
        )
    
    # Check quantity
    available = product.stock_quantity >= quantity
    
    return AvailabilityCheck(
        available=available,
        inStock=product.stock_quantity,
        requested=quantity,
        reason=None if available else "Insufficient stock"
    )


@router.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new product.
    
    TODO: Add authentication/authorization - admin only
    
    Args:
        payload: Product creation data
    
    Returns:
        Created product
    
    Raises:
        400: SKU already exists
    """
    # Check if SKU already exists
    existing = db.query(Product).filter(Product.sku == payload.sku).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU '{payload.sku}' already exists"
        )
    
    # Prepare colors JSON
    colors_json = None
    if payload.colors:
        colors_json = json.dumps([c.model_dump() for c in payload.colors])
    
    # Create product
    product = Product(
        sku=payload.sku,
        name=payload.name,
        price=payload.price,
        category=payload.category,
        image=payload.image,
        stock_status=payload.stock_status,
        stock_quantity=payload.stock_quantity,
        lead_time_days=payload.lead_time_days,
        lead_time_text=payload.lead_time_text,
        colors_json=colors_json,
        is_active=payload.is_active
    )
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return _product_to_read(product, include_admin_fields=True)


@router.patch("/products/{sku}", response_model=ProductRead)
def update_product(
    sku: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing product.
    
    TODO: Add authentication/authorization - admin only
    
    Args:
        sku: Product SKU
        payload: Fields to update
    
    Returns:
        Updated product
    
    Raises:
        404: Product not found
    """
    product = db.query(Product).filter(Product.sku == sku).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with SKU '{sku}' not found"
        )
    
    # Update fields that were provided
    update_data = payload.model_dump(exclude_unset=True)
    
    # Handle colors separately
    if 'colors' in update_data:
        colors = update_data.pop('colors')
        if colors is not None:
            product.colors_json = json.dumps([c.model_dump() if isinstance(c, ColorOption) else c for c in colors])
        else:
            product.colors_json = None
    
    # Update remaining fields
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return _product_to_read(product, include_admin_fields=True)


@router.delete("/products/{sku}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    sku: str,
    hard_delete: bool = Query(False, description="Permanently delete (default: soft delete)"),
    db: Session = Depends(get_db)
):
    """
    Delete a product (soft delete by default).
    
    TODO: Add authentication/authorization - admin only
    
    Args:
        sku: Product SKU
        hard_delete: If true, permanently delete. If false, set is_active=False
    
    Raises:
        404: Product not found
    """
    product = db.query(Product).filter(Product.sku == sku).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with SKU '{sku}' not found"
        )
    
    if hard_delete:
        # Permanently delete
        db.delete(product)
    else:
        # Soft delete - mark as inactive
        product.is_active = False
    
    db.commit()
    return


@router.get("/products/categories/list", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """
    Get list of all product categories.
    
    Returns:
        List of unique category names
    """
    categories = db.query(Product.category).filter(
        Product.category.isnot(None),
        Product.is_active == True
    ).distinct().all()
    
    return [c[0] for c in categories if c[0]]
