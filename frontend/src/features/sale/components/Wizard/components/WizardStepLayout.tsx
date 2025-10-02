import type { ReactNode } from 'react';

interface WizardStepLayoutProps {
  title: string;
  stepNumber?: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  canProceed?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  helpText?: string;
}

export function WizardStepLayout({
  children,
  onNext,
  onPrev,
  canProceed = true,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  helpText
}: WizardStepLayoutProps) {
  return (
    <>
      <div className="wizard-step">
        <div className="step-content">
          <div className="step-main">

            {children}
          </div>

          {helpText && !canProceed && (
            <div className="step-help">
              {helpText}
            </div>
          )}
        </div>
      </div>

      <div className="step-actions">
        <div>
          {onPrev && (
            <button
              className="btn btn-secondary"
              onClick={onPrev}
              type="button"
            >
              ← {prevLabel}
            </button>
          )}
        </div>
        
        <div>
          {onNext && (
            <button
              className="btn btn-primary"
              onClick={onNext}
              type="button"
            >
              {nextLabel} →
            </button>
          )}
        </div>
      </div>
    </>
  );
}
