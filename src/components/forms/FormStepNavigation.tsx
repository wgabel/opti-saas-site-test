'use client';

import { useFormStep } from '@optimizely/cms-sdk/forms/react';
import { buttonClass } from './formStyles';

type Props = { totalSteps: number; hasOwnButtons: string[] };

/**
 * Fallback Previous/Next buttons for multi-step forms, shown only when the
 * editor didn't place their own "Previous"/"Next" buttons in that step.
 */
export default function FormStepNavigation({ totalSteps, hasOwnButtons }: Props) {
  const { currentStepIndex, nextStep, prevStep } = useFormStep();
  if (totalSteps < 2) return null;

  const showPrev = currentStepIndex > 0 && !hasOwnButtons.includes('previous');
  const showNext = currentStepIndex < totalSteps - 1 && !hasOwnButtons.includes('next');
  if (!showPrev && !showNext) return null;

  return (
    <div className="form-actions">
      {showPrev && (
        <button type="button" onClick={prevStep} className={buttonClass('previous')}>
          Previous
        </button>
      )}
      {showNext && (
        <button type="button" onClick={nextStep} className={buttonClass('next')}>
          Next
        </button>
      )}
    </div>
  );
}
