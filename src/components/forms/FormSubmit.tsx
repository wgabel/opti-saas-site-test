'use client';

import { ContentProps, OptiFormsSubmitElementContentType } from '@optimizely/cms-sdk';
import { FormElement, getPreviewUtils, useFormButton } from '@optimizely/cms-sdk/forms/react';
import { buttonClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsSubmitElementContentType> };

/**
 * Submit button. Labels "Next", "Previous" or "Back" turn it into step
 * navigation instead — any other label submits the form.
 */
export default function FormSubmit({ content }: Props) {
  const { role, label, isSubmitting, buttonProps } = useFormButton(content);
  const { pa } = getPreviewUtils(content);

  return (
    <FormElement content={content}>
      <button {...buttonProps} className={buttonClass(role)}>
        <span {...pa('Label')}>{isSubmitting ? 'Submitting…' : label}</span>
      </button>
    </FormElement>
  );
}
