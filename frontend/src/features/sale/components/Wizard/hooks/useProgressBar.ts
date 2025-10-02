interface ProgressStep {
  id: string;
  label: string;
  detail: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  isAccessible: boolean;
}

interface UseProgressBarProps {
  steps: ProgressStep[];
  onStepClick?: (stepId: string) => void;
}

export function useProgressBar({ steps, onStepClick }: UseProgressBarProps) {
  // Find the current active step index to determine future steps
  const activeStepIndex = steps.findIndex(step => step.isActive);
  const completedSteps = steps.filter(step => step.isCompleted).length;

  const getStepClass = (step: ProgressStep, index: number) => {
    const isFuture = !step.isActive && !step.isCompleted && activeStepIndex !== -1 && index > activeStepIndex;
    return step.isActive ? 'active' : step.isCompleted ? 'completed' : isFuture ? 'future' : 'pending';
  };

  const isStepClickable = (step: ProgressStep) => {
    return onStepClick && step.isAccessible;
  };

  const handleStepClick = (step: ProgressStep) => {
    if (isStepClickable(step)) {
      onStepClick!(step.id);
    }
  };

  const getStepIcon = (step: ProgressStep) => {
    return step.isActive ? step.icon : (step.isCompleted ? '✓' : step.icon);
  };

  return {
    activeStepIndex,
    completedSteps,
    getStepClass,
    isStepClickable,
    handleStepClick,
    getStepIcon,
  };
}