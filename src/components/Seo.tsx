import { contract } from '@optimizely/cms-sdk';

/** Reusable SEO fields shared by every routable page type. */
export const SeoContract = contract({
  key: 'Seo',
  displayName: 'SEO properties',
  properties: {
    metaTitle: { type: 'string', displayName: 'Meta title', maxLength: 70, group: 'seo' },
    metaDescription: {
      type: 'string',
      displayName: 'Meta description',
      maxLength: 160,
      group: 'seo',
    },
  },
});
