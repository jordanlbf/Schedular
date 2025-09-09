import type { ReactNode } from 'react';

interface WizardStepLayoutProps {
  title: string;
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
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="wizard-page-header compact">
            <h2>{title}</h2>
          </div>

          {errors.length > 0 && (
            <div className="form-errors" role="alert">
              <h4>Please fix the following issues:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {children}
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
                disabled={!canProceed}
                type="button"
              >
                {nextLabel} →
              </button>
            )}
          </div>
        </div>

        {helpText && !canProceed && (
          <div className="step-help">
            {helpText}
          </div>
        )}
      </div>
    </div>
  );
}
