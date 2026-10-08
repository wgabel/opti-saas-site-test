import { BlankExperienceContentType, ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';

/**
 * Renderer for the built-in "Blank Experience" type — the Visual Builder page.
 * Editors compose it from sections (BlankSection, Hero) and elements
 * (Hero, TextBlock, CallToAction) directly on the canvas.
 */
type Props = { content: ContentProps<typeof BlankExperienceContentType> };

export default function BlankExperience({ content }: Props) {
  return (
    <main className="experience">
      <OptimizelyComposition nodes={content.composition.nodes ?? []} />
    </main>
  );
}
