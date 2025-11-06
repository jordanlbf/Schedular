import { addLineToCart, updateLineQuantity, removeLine } from '@/features/sale/components/Cart/utils/cartUtils';
import type {Line, WizardStep} from '@/features/sale/types';
import type { SaleDraftState } from '@/features/sale/stores/useSaleDraftStore';
import { useProductsContext } from '@/features/sale/contexts/ProductsContext';

interface UseWizardCartManagementProps {
  lines: Line[];
  nextId: number;
  currentStep: WizardStep;
  updateField: <K extends keyof SaleDraftState>(field: K, value: SaleDraftState[K] | ((prev: SaleDraftState[K]) => SaleDraftState[K])) => void;
  validation: {
    resetStepAttempted: (step: string) => void;
  };
}

export function useWizardCartManagement({
  lines,
  nextId,
  currentStep,
  updateField,
  validation
}: UseWizardCartManagementProps) {
  const { products } = useProductsContext();

  // Product management functions
  const addLine = (sku: string | number, color?: string) => {
    updateField('lines', (currentLines: Line[]) => {
      const result = addLineToCart(currentLines, sku, nextId, products, color);
      if (result.nextId !== nextId) {
        updateField('nextId', result.nextId);
      }
      return result.lines;
    });
  };

  const changeQty = (id: number, delta: number) => {
    updateField('lines', (currentLines: Line[]) => {
      const newLines = updateLineQuantity(currentLines, id, delta, products);
      // Reset validation state if no valid items remain
      if (currentStep === 'products') {
        const validItems = newLines.filter(line => line.qty > 0);
        if (validItems.length === 0) {
          validation.resetStepAttempted('productsAttempted');
        }
      }
      return newLines;
    });
  };

  const removeLineFromCart = (id: number) => {
    updateField('lines', (currentLines: Line[]) => {
      const newLines = removeLine(currentLines, id);
      // Reset validation state if cart becomes empty
      if (newLines.length === 0 && currentStep === 'products') {
        validation.resetStepAttempted('productsAttempted');
      }
      return newLines;
    });
  };

  const changePriceForLine = (id: number, newPrice: number) => {
    updateField('lines', (currentLines: Line[]) => {
      return currentLines.map(line =>
        line.id === id ? { ...line, price: newPrice } : line
      );
    });
  };

  // Calculate subtotal for product-picker step
  const subtotal = lines.reduce((sum: number, line) => sum + (line.price * line.qty), 0);

  return {
    addLine,
    changeQty,
    removeLineFromCart,
    changePriceForLine,
    subtotal,
  };
}