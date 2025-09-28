import { addLineToCart, updateLineQuantity, removeLine } from '@/features/sale/components/Cart/utils/cartUtils';
import type {Line, WizardStep} from '@/features/sale/types';
import type { SaleDraftState } from '@/features/sale/stores/useSaleDraftStore';

interface UseWizardCartManagementProps {
  lines: Line[];
  nextId: number;
  currentStep: WizardStep;
  updateField: <K extends keyof SaleDraftState>(field: K, value: SaleDraftState[K]) => void;
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

  // Product management functions
  const addLine = (sku: string | number, color?: string) => {
    const result = addLineToCart(lines, sku, nextId, color);
    updateField('lines', result.lines);
    updateField('nextId', result.nextId);
  };

  const changeQty = (id: number, delta: number) => {
    const newLines = updateLineQuantity(lines, id, delta);
    updateField('lines', newLines);
    // Reset validation state if no valid items remain
    if (currentStep === 'products') {
      const validItems = newLines.filter(line => line.qty > 0);
      if (validItems.length === 0) {
        validation.resetStepAttempted('productsAttempted');
      }
    }
  };

  const removeLineFromCart = (id: number) => {
    const newLines = removeLine(lines, id);
    updateField('lines', newLines);
    // Reset validation state if cart becomes empty
    if (newLines.length === 0 && currentStep === 'products') {
      validation.resetStepAttempted('productsAttempted');
    }
  };

  const changePriceForLine = (id: number, newPrice: number) => {
    const newLines = lines.map(line =>
      line.id === id ? { ...line, price: newPrice } : line
    );
    updateField('lines', newLines);
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