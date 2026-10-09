'use client';

import { ContentProps, OptiFormsRangeElementContentType } from '@optimizely/cms-sdk';
import { FormElement, getPreviewUtils, useFormField } from '@optimizely/cms-sdk/forms/react';
import { labelClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsRangeElementContentType> };

export default function FormRange({ content }: Props) {
  const { fieldProps, value } = useFormField({
    content,
    defaultValue: content.PredefinedValue ?? String(content.Min ?? 0),
  });
  const { pa } = getPreviewUtils(content);

  return (
    <FormElement content={content}>
      <div className="form-field">
        {content.Label && (
          <label htmlFor={fieldProps.id} className={labelClass} {...pa('Label')}>
            {content.Label}: <strong>{value}</strong>
          </label>
        )}
        <input
          {...fieldProps}
          type="range"
          min={content.Min ?? 0}
          max={content.Max ?? 100}
          step={content.Increment ?? 1}
          title={content.Tooltip ?? ''}
        />
      </div>
    </FormElement>
  );
}
