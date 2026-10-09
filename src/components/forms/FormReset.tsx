'use client';

import { ContentProps, OptiFormsResetElementContentType } from '@optimizely/cms-sdk';
import { FormElement, getPreviewUtils, useFormButton } from '@optimizely/cms-sdk/forms/react';
import { buttonClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsResetElementContentType> };

export default function FormReset({ content }: Props) {
  const { label, buttonProps } = useFormButton(content, { role: 'reset' });
  const { pa } = getPreviewUtils(content);

  return (
    <FormElement content={content}>
      <button {...buttonProps} className={buttonClass('reset')}>
        <span {...pa('Label')}>{label}</span>
      </button>
    </FormElement>
  );
}
