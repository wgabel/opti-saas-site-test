'use client';

import { errorTextClass } from './formStyles';

type Props = {
  show: boolean;
  errors: string[];
  errorProps: Record<string, unknown>;
};

/** Validation messages under a field. */
export default function FieldErrors({ show, errors, errorProps }: Props) {
  if (!show) return null;
  return (
    <div {...errorProps}>
      {errors.map((message) => (
        <p key={message} className={errorTextClass}>
          {message}
        </p>
      ))}
    </div>
  );
}
