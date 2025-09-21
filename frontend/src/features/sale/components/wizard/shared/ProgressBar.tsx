interface ProgressBarProps {
  steps: {
    id: string;
    label: string;
    detail: string;
    icon: string;
    isActive: boolean;
    isCompleted: boolean;
    isAccessible: boolean;
  }[];
  onStepClick?: (stepId: string) => void;
}

export function ProgressBar({ steps, onStepClick }: ProgressBarProps) {
  // Find the current active step index to determine future steps
  const activeStepIndex = steps.findIndex(step => step.isActive);
  const completedSteps = steps.filter(step => step.isCompleted).length;
  
  return (
    <div className="progress-bar">
      <div className="progress-steps-container" data-completed-steps={completedSteps}>
        {steps.map((step, index) => {
          const isFuture = !step.isActive && !step.isCompleted && activeStepIndex !== -1 && index > activeStepIndex;
          const stepClass = step.isActive ? 'active' : step.isCompleted ? 'completed' : isFuture ? 'future' : 'pending';
          const isClickable = onStepClick && step.isAccessible;

          const handleStepClick = () => {
            if (isClickable) {
              onStepClick(step.id);
            }
          };
          
          return (
            <div
              key={step.id}
              className={`progress-step ${stepClass} ${isClickable ? 'clickable' : ''}`}
              onClick={handleStepClick}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
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
