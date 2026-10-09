'use client';

import type { ComponentProps } from 'react';
import { createJsonSubmitHandler, FormWrapper } from '@optimizely/cms-sdk/forms/react';

type Props = Omit<ComponentProps<typeof FormWrapper>, 'submitHandler'> & { formKey?: string };

/**
 * Sends every submission as JSON to this site's own /api/forms/submit route,
 * which stores/forwards it server-side (see src/app/api/forms/submit/route.ts).
 */
export default function FormContainerClient({ formKey, ...props }: Props) {
  return (
    <FormWrapper submitHandler={createJsonSubmitHandler('/api/forms/submit', formKey)} {...props} />
  );
}
