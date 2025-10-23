interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return <div className="bg-primary-blue h-[2px] overflow-hidden duration-300" style={{ width: `${progress}%` }} />;
}
