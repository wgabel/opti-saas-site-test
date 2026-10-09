'use client';

import { ContentProps, OptiFormsSelectionElementContentType } from '@optimizely/cms-sdk';
import { getSelectionOptions } from '@optimizely/cms-sdk/forms/validation';
import { FormElement, getPreviewUtils, useFormField } from '@optimizely/cms-sdk/forms/react';
import FieldErrors from './FieldErrors';
import { controlClass, labelClass, requiredMarkClass } from './formStyles';

type Props = { content: ContentProps<typeof OptiFormsSelectionElementContentType> };

/** "Selection": a dropdown (multi-select list when multi-select is on). */
export default function FormSelection({ content }: Props) {
  const options = getSelectionOptions(content);
  const isMulti = content.AllowMultiSelect === true;
  const { value, setValue, inputRef, onBlur, errorId, errorProps, errors, showErrors, isRequired } =
    useFormField<HTMLDivElement>({
      content,
      defaultValue: isMulti
        ? options.filter((o) => o.selected).map((o) => o.value).join(',')
        : (options.find((o) => o.selected)?.value ?? ''),
    });
  const { pa } = getPreviewUtils(content);
  const name = content.SubmissionFieldName ?? content.Label ?? '';
  const id = `sel-${content._metadata?.key ?? name}`;

  return (
    <FormElement content={content}>
      <div className="form-field" ref={inputRef}>
        {content.Label && (
          <label htmlFor={id} className={labelClass} {...pa('Label')}>
            {content.Label}
            {isRequired && <span className={requiredMarkClass}>*</span>}
          </label>
        )}
        <select
          id={id}
          name={name}
          multiple={isMulti}
          value={isMulti ? value.split(',').filter(Boolean) : value}
          onChange={(e) => {
            setValue(
              isMulti
                ? Array.from(e.target.selectedOptions, (o) => o.value).join(',')
                : e.target.value,
            );
            onBlur();
          }}
          onBlur={onBlur}
          title={content.Tooltip ?? ''}
          aria-invalid={showErrors}
          aria-describedby={errorId}
          className={controlClass(showErrors)}
          {...pa('Options')}
        >
          {!isMulti && <option value="">{content.Placeholder || '-- Select --'}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldErrors show={showErrors} errors={errors} errorProps={errorProps} />
      </div>
    </FormElement>
  );
}
