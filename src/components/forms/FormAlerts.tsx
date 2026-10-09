'use client';

import { useFormSubmission } from '@optimizely/cms-sdk/forms/react';

export default function FormAlerts({ submitConfirmationMessage }: { submitConfirmationMessage: string | null }) {
  const { formSuccess, formError, errorMessage } = useFormSubmission();

  if (formSuccess) {
    return (
      <div role="alert" className="form-alert form-alert--success">
        {submitConfirmationMessage || 'Thank you. Your form has been submitted.'}
      </div>
    );
  }
  if (formError) {
    return (
      <div role="alert" className="form-alert form-alert--error">
        {errorMessage || 'Sorry, the form could not be submitted. Please try again.'}
      </div>
    );
  }
  return null;
}
