import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { getContentByPath, toCmsPath } from '@/lib/content';

/**
 * Published site. Pages are rendered on first request and cached (ISR).
 * The Graph webhook (/api/revalidate/[secret]) purges them on publish;
 * `revalidate` is a safety net in case a webhook is missed.
 */
export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentByPath(toCmsPath(slug));
  if (!content) return {};
  return {
    title: content.metaTitle || content.heading || content._metadata?.displayName,
    description: content.metaDescription || undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getContentByPath(toCmsPath(slug));
  if (!content) notFound();
  return <OptimizelyComponent content={content} />;
}
