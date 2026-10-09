/**
 * Receives form submissions from every Optimizely form on the site.
 *
 * Optimizely does NOT store submissions for headless sites — this route decides
 * where they go:
 *   1. Always: written to the server log (Vercel → project → Logs, search "FORM SUBMISSION").
 *   2. If FORMS_WEBHOOK_URL is set: forwarded as JSON to that URL
 *      (e.g. Power Automate, Zapier, Make, a CRM endpoint, or webhook.site for testing).
 *
 * The "Submit URL" field on the form in the CMS is deliberately ignored, so an
 * editor can't redirect visitors' data to an arbitrary server.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Body = { targetUrl?: string; payload?: Record<string, unknown>; formKey?: string };

const MAX_BODY_BYTES = 100_000;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ message: 'Submission too large' }, { status: 413 });
  }

  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: 'Invalid submission' }, { status: 400 });
  }
  if (!body.payload || typeof body.payload !== 'object') {
    return NextResponse.json({ message: 'Invalid submission' }, { status: 400 });
  }

  const submission = {
    formKey: body.formKey ?? null,
    submittedAt: new Date().toISOString(),
    page: request.headers.get('referer'),
    data: body.payload,
  };

  console.log('FORM SUBMISSION', JSON.stringify(submission));

  const webhook = process.env.FORMS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!res.ok) {
        console.error('FORM WEBHOOK FAILED', res.status, await res.text().catch(() => ''));
        return NextResponse.json({ message: 'Could not deliver your submission. Please try again.' }, { status: 502 });
      }
    } catch (err) {
      console.error('FORM WEBHOOK ERROR', err);
      return NextResponse.json({ message: 'Could not deliver your submission. Please try again.' }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
