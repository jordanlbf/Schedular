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
  return (
    <div className="progress-bar">
      <div className="progress-steps-container">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`progress-step ${
              step.isActive ? 'active' : step.isCompleted ? 'completed' : 'pending'
            }`}
          >
            <div className="step-icon">
              {step.isCompleted ? '✓' : step.icon}
            </div>
            <div>
              <div className="step-label">{step.label}</div>
              <div className="step-detail">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
