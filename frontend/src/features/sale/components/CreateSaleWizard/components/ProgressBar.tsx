import { useProgressBar } from '../hooks/useProgressBar';
import './ProgressBar.css';

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
  const {
    completedSteps,
    getStepClass,
    isStepClickable,
    handleStepClick,
    getStepIcon
  } = useProgressBar({ steps, onStepClick });

  return (
    <div className="progress-bar">
      <div className="progress-steps-container" data-completed-steps={completedSteps}>
        {steps.map((step, index) => {
          const stepClass = getStepClass(step, index);
          const isClickable = isStepClickable(step);

          return (
            <div
              key={step.id}
              className={`progress-step ${stepClass} ${isClickable ? 'clickable' : ''}`}
              onClick={() => handleStepClick(step)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div className="step-icon">
                {getStepIcon(step)}
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
