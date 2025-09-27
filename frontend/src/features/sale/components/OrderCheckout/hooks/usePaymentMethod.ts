import { useCallback, useMemo } from 'react';
import type { SaleTotals } from '../../../hooks/useSaleTotals';

interface UsePaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  totals: SaleTotals;
}

export function usePaymentMethod({
  paymentMethod,
  setPaymentMethod,
  depositAmount,
  setDepositAmount,
  totals
}: UsePaymentMethodProps) {

  const isFinancing = paymentMethod === 'financing';

  const handlePaymentMethodChange = useCallback((method: string) => {
    setPaymentMethod(method);
    // Reset deposit when switching away from financing
    if (method !== 'financing') {
      setDepositAmount(0);
    }
  }, [setPaymentMethod, setDepositAmount]);

  const handleDepositChange = useCallback((value: string) => {
    const numValue = Number(value || 0);
    // Convert to cents and clamp between 0 and total
    const centsValue = Math.round(numValue * 100);
    const clampedValue = Math.min(totals.total, Math.max(0, centsValue));
    setDepositAmount(clampedValue);
  }, [setDepositAmount, totals.total]);

  const formatDepositValue = useCallback(() => {
    return (depositAmount / 100).toFixed(2);
  }, [depositAmount]);

  const financingCalculations = useMemo(() => {
    if (!isFinancing) return null;

    return {
      depositToday: depositAmount,
      balanceOnDelivery: totals.total - depositAmount,
      maxDeposit: totals.total / 100, // For input max attribute
    };
  }, [isFinancing, depositAmount, totals.total]);

  return {
    isFinancing,
    handlePaymentMethodChange,
    handleDepositChange,
    formatDepositValue,
    financingCalculations,
  };
}