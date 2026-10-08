import { contentType, ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText } from "@optimizely/cms-sdk/react/richText";
import { SeoContract } from "./Seo";

export const ArticlePageContentType = contentType({
  key: "ArticlePage",
  displayName: "Article page",
  baseType: "_page",
  extends: SeoContract,
  properties: {
    heading: {
      type: "string",
      displayName: "Heading",
      isRequired: true,
      indexingType: "searchable",
    },
    intro: { type: "string", displayName: "Intro" },
    image: {
      type: "contentReference",
      allowedTypes: ["_image"],
      displayName: "Main image",
    },
    body: { type: "richText", displayName: "Body" },
    publishDate: {
      type: "dateTime",
      displayName: "Publish date",
      indexingType: "queryable",
    },
  },
});

type Props = { content: ContentProps<typeof ArticlePageContentType> };

export default function ArticlePage({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const img = src(content.image);

  return (
    <main className="container article">
      <h1 {...pa("heading")}>{content.heading}</h1>
      {content.publishDate && (
        <time {...pa("publishDate")} dateTime={content.publishDate}>
          {new Date(content.publishDate).toLocaleDateString()}
        </time>
      )}
      {content.intro && (
        <p className="lead" {...pa("intro")}>
          {content.intro}
        </p>
      )}
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="article__image" src={img} alt="" {...pa("image")} />
      )}
      <div className="prose" {...pa("body")}>
        <RichText content={content.body?.json} />
      </div>
    </main>
  );
}
