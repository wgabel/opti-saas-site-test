// Registers (or lists) the Optimizely Graph webhook that purges the Next.js cache on publish.
//
//   npm run webhook:create   -> POST https://<SITE_URL>/api/revalidate/<REVALIDATE_SECRET>
//   npm run webhook:list     -> show existing webhooks
//
// Needs in .env: OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET, SITE_URL, REVALIDATE_SECRET
// API reference: https://docs.developers.optimizely.com/platform-optimizely/reference/create-webhookhandler
import 'dotenv/config';

const API = process.env.OPTIMIZELY_GRAPH_API_URL || 'https://prod.cg.optimizely.com/api';
const { OPTIMIZELY_GRAPH_APP_KEY: appKey, OPTIMIZELY_GRAPH_SECRET: secret } = process.env;
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
const hookSecret = process.env.REVALIDATE_SECRET;

const missing = Object.entries({
  OPTIMIZELY_GRAPH_APP_KEY: appKey,
  OPTIMIZELY_GRAPH_SECRET: secret,
  ...(process.argv.includes('--list') ? {} : { SITE_URL: siteUrl, REVALIDATE_SECRET: hookSecret }),
})
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const headers = {
  Authorization: 'Basic ' + Buffer.from(`${appKey}:${secret}`).toString('base64'),
  'Content-Type': 'application/json',
};

if (process.argv.includes('--list')) {
  const res = await fetch(`${API}/webhooks`, { headers });
  console.log(res.status, JSON.stringify(await res.json().catch(() => null), null, 2));
  process.exit(res.ok ? 0 : 1);
}

const body = {
  disabled: false,
  request: { url: `${siteUrl}/api/revalidate/${hookSecret}`, method: 'post' },
  topic: ['*.*'],
  filters: { status: { eq: 'Published' } },
};

console.log(`Creating webhook -> ${siteUrl}/api/revalidate/***`);
const res = await fetch(`${API}/webhooks`, { method: 'POST', headers, body: JSON.stringify(body) });
const text = await res.text();
if (!res.ok) {
  console.error(`Failed (${res.status}): ${text}`);
  process.exit(1);
}
console.log('Webhook created:', text);
