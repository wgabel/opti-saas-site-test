import { contentType, ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText } from '@optimizely/cms-sdk/react/richText';

export const TextBlockContentType = contentType({
  key: 'TextBlock',
  displayName: 'Text',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    body: { type: 'richText', displayName: 'Body' },
  },
});

type Props = { content: ContentProps<typeof TextBlockContentType> };

export default function TextBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div className="prose" {...pa('body')}>
      <RichText content={content.body?.json} />
    </div>
  );
}
