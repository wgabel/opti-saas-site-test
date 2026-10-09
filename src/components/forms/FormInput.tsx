'use client';

import { ContentProps, OptiFormsTextboxElementContentType } from '@optimizely/cms-sdk';
import { getHtmlValidationAttributes, toValidators } from '@optimizely/cms-sdk/forms/validation';
import { FormElement, getPreviewUtils, useFormField } from '@optimizely/cms-sdk/forms/react';
import FieldErrors from './FieldErrors';
import { controlClass, labelClass, requiredMarkClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsTextboxElementContentType> };

/** Textbox (also used for email fields — "email" is a validator in the CMS). */
export default function FormInput({ content }: Props) {
  const { fieldProps, errorProps, errors, showErrors, isRequired } = useFormField({ content });
  const htmlAttrs = getHtmlValidationAttributes(toValidators(content.Validators));
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
        <input
          {...fieldProps}
          type={(htmlAttrs.type as string) ?? 'text'}
          placeholder={content.Placeholder ?? ''}
          title={content.Tooltip ?? ''}
          autoComplete={content.AutoComplete ?? 'off'}
          pattern={htmlAttrs.pattern as string | undefined}
          className={controlClass(showErrors)}
          {...pa('Placeholder')}
        />
        <FieldErrors show={showErrors} errors={errors} errorProps={errorProps} />
      </div>
    </FormElement>
  );
}
