'use client';

import { useFormStep } from '@optimizely/cms-sdk/forms/react';

/** "Step 2 of 3" label for multi-step forms. */
export default function FormStepTracker({ steps }: { steps: number }) {
  const { currentStepIndex } = useFormStep();
  if (steps < 2) return null;
  return (
    <p className="form-step-tracker">
      Step {currentStepIndex + 1} of {steps}
    </p>
  );
}
