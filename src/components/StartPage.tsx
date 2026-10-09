import { contentType, ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { HeroContentType, HeroView } from './Hero';
import { TextBlockContentType } from './TextBlock';
import { CallToActionContentType } from './CallToAction';
import { SeoContract } from './Seo';

export const StartPageContentType = contentType({
  key: 'StartPage',
  displayName: 'Start page',
  baseType: '_page',
  extends: SeoContract,
  mayContainTypes: ['*'], // any page or Visual Builder experience may live under the start page
  properties: {
    hero: { type: 'component', contentType: HeroContentType, displayName: 'Hero' },
    mainContent: {
      type: 'array',
      displayName: 'Main content area',
      items: {
        type: 'content',
        allowedTypes: [HeroContentType, TextBlockContentType, CallToActionContentType],
      },
    },
  },
});

type Props = { content: ContentProps<typeof StartPageContentType> };

export default function StartPage({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);

  return (
    <main>
      {content.hero && (
        <div {...pa('hero')}>
          <HeroView
            heading={content.hero.heading}
            summary={content.hero.summary}
            theme={content.hero.theme}
            imageUrl={src(content.hero.image)}
            attrs={(p) => pa(`hero.${p}`)}
          />
        </div>
      )}
      <div className="container stack" {...pa('mainContent')}>
        {content.mainContent?.map((item, i) => {
          // Each block gets data-epi-block-id (edit mode only) so the CMS can
          // scope the block's own field overlays and make it selectable.
          const key = (item as { _metadata?: { key?: string | null } })._metadata?.key;
          return (
            <div key={key ?? i} {...(key ? pa({ key }) : {})}>
              <OptimizelyComponent content={item} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
