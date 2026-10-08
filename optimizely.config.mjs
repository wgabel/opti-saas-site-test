import { buildConfig } from '@optimizely/cms-sdk';

/**
 * Code-first content model. `npm run cms:push` reads every content type
 * exported from the files below and creates/updates it in the CMS.
 */
export default buildConfig({
  components: ['./src/components/**/*.tsx'],
  propertyGroups: [
    { key: 'seo', displayName: 'SEO', sortOrder: 10 },
  ],
});
