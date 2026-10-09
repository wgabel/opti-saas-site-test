import type { ReactNode } from 'react';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GridProps = { node: any; children?: ReactNode };

/** Row and column of a form step, as laid out by the editor in the CMS. */
export function GridRow({ node, children }: GridProps) {
  const { pa } = getPreviewUtils(node);
  return (
    <div className="form-row" {...pa(node)}>
      {children}
    </div>
  );
}

export function GridColumn({ node, children }: GridProps) {
  const { pa } = getPreviewUtils(node);
  return (
    <div className="form-col" {...pa(node)}>
      {children}
    </div>
  );
}
