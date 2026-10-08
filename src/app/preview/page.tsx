import Script from 'next/script';
import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { NextPreviewComponent } from '@optimizely/cms-sdk/react/nextjs';

/**
 * Live preview / on-page editing route. The CMS loads
 *   /preview?preview_token=…&key=…&ver=…&loc=…&ctx=edit|preview
 * in an iframe. Never cached: every request carries a short-lived token
 * and returns draft content.
 */
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function PreviewPage({ searchParams }: Props) {
  const params = (await searchParams) as unknown as PreviewParams;

  if (!params.preview_token || !params.key) {
    return (
      <main className="container">
        <h1>Preview</h1>
        <p>This route is opened by Optimizely CMS with a preview token. Open a page in the CMS editor.</p>
      </main>
    );
  }

  const content = await getClient().getPreviewContent(params);
  const injector = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  return (
    <>
      <Script src={injector} strategy="afterInteractive" />
      <NextPreviewComponent />
      <OptimizelyComponent content={content} />
    </>
  );
}

export default withAppContext(PreviewPage);
