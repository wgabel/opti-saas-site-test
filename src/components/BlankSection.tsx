import { BlankSectionContentType, ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

/** Renderer for the built-in "Blank Section": a grid of rows and columns. */
type Props = { content: ContentProps<typeof BlankSectionContentType> };

export default function BlankSection({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <section className="container section" {...pa(content)}>
      <OptimizelyGridSection nodes={content.nodes} />
    </section>
  );
}
