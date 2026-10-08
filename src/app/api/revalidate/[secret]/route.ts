/**
 * Optimizely Graph webhook → Next.js cache purge.
 * Register it with `npm run webhook:create`. Graph calls
 *   POST https://<site>/api/revalidate/<REVALIDATE_SECRET>
 * whenever content is published, and we purge the affected page.
 * Payload format: https://docs.developers.optimizely.com/platform-optimizely/docs/webhook-response
 */
import { revalidatePath } from 'next/cache';
import { getClient } from '@optimizely/cms-sdk';

export const dynamic = 'force-dynamic';

const PATH_QUERY = /* GraphQL */ `
  query GetPath($id: String, $locale: Locales) {
    _Content(ids: [$id], locale: [$locale]) {
      item { _metadata { url { default } } }
    }
  }
`;

async function pathForDoc(docId: string): Promise<string | null> {
  // docId = "<guid>_<locale>_<status>"; Graph ids are the guid without dashes
  const [guid, locale] = docId.split('_');
  const res = await getClient().request(PATH_QUERY, { id: guid.replaceAll('-', ''), locale });
  const url: string | undefined = res?._Content?.item?._metadata?.url?.default;
  if (!url) return null;
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function POST(req: Request, { params }: { params: Promise<{ secret: string }> }) {
  const { secret } = await params;
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Not found', { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const subject = body?.type?.subject;
  const action = body?.type?.action;

  try {
    if (subject === 'doc' && action === 'updated' && body?.data?.docId) {
      const path = await pathForDoc(body.data.docId);
      if (path) {
        revalidatePath(path);
        // The start page is also served at "/"
        if (path.split('/').filter(Boolean).length <= 1) revalidatePath('/');
        return Response.json({ revalidated: path });
      }
    }
    // Deletes, bulk syncs, components shown on many pages, or unknown events:
    // purge everything. Cheap for small/medium sites.
    revalidatePath('/', 'layout');
    return Response.json({ revalidated: 'all' });
  } catch (err) {
    revalidatePath('/', 'layout');
    return Response.json({ revalidated: 'all', warning: String(err) });
  }
}
