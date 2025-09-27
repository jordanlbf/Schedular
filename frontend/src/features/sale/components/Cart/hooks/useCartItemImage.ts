import { useState, useEffect, useMemo } from 'react';
import type { Product, Line } from '@/features/sale/types';
import { CATALOG } from '@/features/sale/catalog';

interface UseCartItemImageProps {
  line: Line;
  product?: Product;
}

interface UseCartItemImageReturn {
  productImage: string | undefined;
  imageLoading: boolean;
  imageError: boolean;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export function useCartItemImage({
  line,
  product
}: UseCartItemImageProps): UseCartItemImageReturn {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize expensive calculations
  const originalProduct = useMemo(() => CATALOG.find(p => p.sku === line.sku), [line.sku]);

  // Get the correct image based on selected color
  const productImage = useMemo(() => {
    if (!originalProduct) return product?.image;

    // If no color is selected, use default product image
    if (!line.color) return originalProduct.image;

    // Find the color-specific image
    const selectedColor = originalProduct.colors?.find(color => color.name === line.color);
    return selectedColor?.image || originalProduct.image;
  }, [originalProduct, line.color, product?.image]);

  // Reset image loading state when image changes
  useEffect(() => {
    if (productImage) {
      // Only set loading if image is not already cached
      const img = new Image();
      img.src = productImage;
      if (!img.complete) {
        setImageLoading(true);
        setImageError(false);
      } else {
        setImageLoading(false);
      }
    }
  }, [productImage]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return {
    productImage,
    imageLoading,
    imageError,
    handleImageLoad,
    handleImageError
  };
}