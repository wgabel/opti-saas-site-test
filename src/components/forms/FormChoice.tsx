'use client';

import { ContentProps, OptiFormsChoiceElementContentType } from '@optimizely/cms-sdk';
import { getSelectionOptions } from '@optimizely/cms-sdk/forms/validation';
import { FormElement, getPreviewUtils, useFormField } from '@optimizely/cms-sdk/forms/react';
import FieldErrors from './FieldErrors';
import { labelClass, requiredMarkClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsChoiceElementContentType> };

/** "Multiple or single choice": radio buttons, or checkboxes when multi-select is on. */
export default function FormChoice({ content }: Props) {
  const options = getSelectionOptions(content);
  const isMulti = content.AllowMultiSelect === true;
  const { value, setValue, inputRef, onBlur, errorId, errorProps, errors, showErrors, isRequired } =
    useFormField<HTMLFieldSetElement>({
      content,
      defaultValue: isMulti
        ? options.filter((o) => o.selected).map((o) => o.value).join(',')
        : (options.find((o) => o.selected)?.value ?? ''),
    });
  const { pa } = getPreviewUtils(content);
  const selected = isMulti ? value.split(',').filter(Boolean) : [value];
  const name = content.SubmissionFieldName ?? content.Label ?? '';

  function toggle(optionValue: string) {
    if (isMulti) {
      const next = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
      setValue(next.join(','));
    } else {
      setValue(optionValue);
    }
    onBlur();
  }

  return (
    <FormElement content={content}>
      <fieldset ref={inputRef} className="form-field form-fieldset">
        {content.Label && (
          <legend className={labelClass} {...pa('Label')}>
            {content.Label}
            {isRequired && <span className={requiredMarkClass}>*</span>}
          </legend>
        )}
        <div {...pa('Options')}>
          {options.map((option) => (
            <label key={option.value} className="form-option">
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={name}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                aria-invalid={showErrors}
                aria-describedby={errorId}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldErrors show={showErrors} errors={errors} errorProps={errorProps} />
      </fieldset>
    </FormElement>
  );
}
