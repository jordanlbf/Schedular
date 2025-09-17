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
  errors?: string[];
  helpText?: string;
}

export function WizardStepLayout({
  title,
  stepNumber = '1',
  children,
  onNext,
  onPrev,
  canProceed = true,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  errors = [],
  helpText
}: WizardStepLayoutProps) {
  return (
    <>
      <div className="wizard-step">
        <div className="step-content">
          <div className="step-main">
            <div className="wizard-page-header compact">
              <h2 data-step={stepNumber} className="sr-only">{title}</h2>
            </div>

            {children}
            
            {errors.length > 0 && (
              <div className="subtle-error-message" role="alert">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
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
