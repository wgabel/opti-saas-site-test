/** Shared class names for form fields (styles live in src/app/globals.css). */
export const labelClass = 'form-label';
export const requiredMarkClass = 'form-required';
export const errorTextClass = 'form-error';
export const controlClass = (hasError: boolean) =>
  hasError ? 'form-control form-control--error' : 'form-control';
export const buttonClass = (role: string) =>
  `button form-button form-button--${role === 'previous' || role === 'reset' ? 'secondary' : 'primary'}`;
