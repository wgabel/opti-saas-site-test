'use client';

import { ContentProps, OptiFormsTextareaElementContentType } from '@optimizely/cms-sdk';
import { FormElement, getPreviewUtils, useFormField } from '@optimizely/cms-sdk/forms/react';
import FieldErrors from './FieldErrors';
import { controlClass, labelClass, requiredMarkClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsTextareaElementContentType> };

export default function FormTextarea({ content }: Props) {
  const { fieldProps, errorProps, errors, showErrors, isRequired } =
    useFormField<HTMLTextAreaElement>({ content });
  const { pa } = getPreviewUtils(content);

  return (
    <FormElement content={content}>
      <div className="form-field">
        {content.Label && (
          <label htmlFor={fieldProps.id} className={labelClass} {...pa('Label')}>
            {content.Label}
            {isRequired && <span className={requiredMarkClass}>*</span>}
          </label>
        )}
        <textarea
          {...fieldProps}
          rows={4}
          placeholder={content.Placeholder ?? ''}
          title={content.Tooltip ?? ''}
          autoComplete={content.AutoComplete ?? 'off'}
          className={controlClass(showErrors)}
          {...pa('Placeholder')}
        />
        <FieldErrors show={showErrors} errors={errors} errorProps={errorProps} />
      </div>
    </FormElement>
  );
}
