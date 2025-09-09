interface ProgressBarProps {
  steps: {
    id: string;
    label: string;
    detail: string;
    icon: string;
    isActive: boolean;
    isCompleted: boolean;
  }[];
}

export function ProgressBar({ steps }: ProgressBarProps) {
  // Find the current active step index to determine future steps
  const activeStepIndex = steps.findIndex(step => step.isActive);
  
  return (
    <div className="progress-bar">
      <div className="progress-steps-container">
        {steps.map((step, index) => {
          const isFuture = !step.isActive && !step.isCompleted && activeStepIndex !== -1 && index > activeStepIndex;
          const stepClass = step.isActive ? 'active' : step.isCompleted ? 'completed' : isFuture ? 'future' : 'pending';
          
          return (
            <div
              key={step.id}
              className={`progress-step ${stepClass}`}
            >
              <div className="step-icon">
                {step.isActive ? step.icon : (step.isCompleted ? '✓' : step.icon)}
              </div>
              <div>
                <div className="step-label">{step.label}</div>
                <div className="step-detail">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
