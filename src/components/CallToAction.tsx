import { contentType, ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";

export const CallToActionContentType = contentType({
  key: "CallToAction",
  displayName: "Call to action",
  baseType: "_component",
  compositionBehaviors: ["elementEnabled"],
  properties: {
    label: { type: "string", displayName: "Button label", isRequired: true },
    link: { type: "url", displayName: "Link" },
  },
});

type Props = { content: ContentProps<typeof CallToActionContentType> };

export default function CallToAction({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <p className="cta">
      <a
        className="button"
        href={content.link?.default ?? "#"}
        {...pa("label")}
      >
        {content.label}
      </a>
    </p>
  );
}
