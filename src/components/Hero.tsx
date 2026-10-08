import { contentType, ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";

export const HeroContentType = contentType({
  key: "Hero",
  displayName: "Hero",
  baseType: "_component",
  // Usable as a block, a Visual Builder section, and a Visual Builder element
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  properties: {
    heading: { type: "string", displayName: "Heading", isRequired: true },
    summary: { type: "string", displayName: "Summary" },
    image: {
      type: "contentReference",
      allowedTypes: ["_image"],
      displayName: "Background image",
    },
    theme: {
      type: "string",
      displayName: "Theme",
      enum: [
        { value: "light", displayName: "Light" },
        { value: "dark", displayName: "Dark" },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof HeroContentType> };

type HeroViewProps = {
  heading?: string | null;
  summary?: string | null;
  theme?: string | null;
  imageUrl?: string;
  /** Returns on-page-editing attributes for a property name */
  attrs: (property: string) => object;
};

/** Markup shared by the standalone Hero block and the inline hero on StartPage. */
export function HeroView({
  heading,
  summary,
  theme,
  imageUrl,
  attrs,
}: HeroViewProps) {
  return (
    <header className={`hero hero--${theme ?? "light"}`}>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hero__bg" src={imageUrl} alt="" {...attrs("image")} />
      )}
      <div className="hero__inner">
        <h1 {...attrs("heading")}>{heading}</h1>
        {summary && <p {...attrs("summary")}>{summary}</p>}
      </div>
    </header>
  );
}

export default function Hero({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  return (
    <HeroView
      heading={content.heading}
      summary={content.summary}
      theme={content.theme}
      imageUrl={src(content.image)}
      attrs={(p) => pa(p)}
    />
  );
}
