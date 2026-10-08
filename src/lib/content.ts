import 'server-only';
import { cache } from 'react';
import { getClient } from '@optimizely/cms-sdk';

export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en';

/** Map the Next.js catch-all segments to a CMS URL path ("/en/about/"). */
export function toCmsPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return `/${DEFAULT_LOCALE}/`;
  return `/${slug.map(decodeURIComponent).join('/')}/`;
}

/** Fetch published content by path. Wrapped in React `cache` so page + metadata share one request. */
export const getContentByPath = cache(async (path: string) => {
  const items = await getClient().getContentByPath(path);
  return items[0] ?? null;
});
