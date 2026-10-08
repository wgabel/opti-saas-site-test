/**
 * One-time SDK setup: Graph client config + content-type/component registries.
 * Imported once from the root layout so it runs before any page renders.
 */
import {
  BlankExperienceContentType,
  BlankSectionContentType,
  config,
  initContentTypeRegistry,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';

import StartPage, { StartPageContentType } from '@/components/StartPage';
import ArticlePage, { ArticlePageContentType } from '@/components/ArticlePage';
import Hero, { HeroContentType } from '@/components/Hero';
import TextBlock, { TextBlockContentType } from '@/components/TextBlock';
import CallToAction, { CallToActionContentType } from '@/components/CallToAction';
import BlankExperience from '@/components/BlankExperience';
import BlankSection from '@/components/BlankSection';

config({
  // A placeholder keeps `next build` working before env vars exist;
  // real requests will fail clearly until the key is set.
  apiKey: process.env.OPTIMIZELY_GRAPH_SINGLE_KEY || 'missing-OPTIMIZELY_GRAPH_SINGLE_KEY',
  graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  fragment: { richTextFormat: 'json' },
  query: { host: process.env.APPLICATION_HOST || undefined },
});

initContentTypeRegistry([
  StartPageContentType,
  ArticlePageContentType,
  HeroContentType,
  TextBlockContentType,
  CallToActionContentType,
  BlankExperienceContentType,
  BlankSectionContentType,
]);

// Keys must match the content type `key` (= GraphQL __typename)
initReactComponentRegistry({
  resolver: {
    StartPage,
    ArticlePage,
    Hero,
    TextBlock,
    CallToAction,
    BlankExperience,
    BlankSection,
  },
});
