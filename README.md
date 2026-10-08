# Optimizely CMS (SaaS) + Next.js headless starter

A Next.js 16 frontend for an Optimizely CMS SaaS instance, ready for Vercel. Includes:

- A **code-first content model** (`src/components/*`) that you push to the CMS with one command
- **Published site** rendered from Optimizely Graph, cached on Vercel (ISR)
- **Live preview + on-page editing** (`/preview`), including Visual Builder experiences
- **Instant cache purge on publish** through an Optimizely Graph webhook

Built on the official SDK: `@optimizely/cms-sdk` / `@optimizely/cms-cli` **3.0.2**.

```
 Editor ──► Optimizely CMS (SaaS) ──sync──► Optimizely Graph (GraphQL, cg.optimizely.com)
              │  iframe /preview?preview_token=…          │                │
              ▼                                           │ published      │ webhook on publish
        Next.js on Vercel  ◄──────── draft content ───────┘ content        ▼
        /[[...slug]]  (ISR)  ◄────────────────────────────────  /api/revalidate/<secret>
        /preview      (dynamic, never cached)
```

## Content model

| Type | Base | Used for |
|---|---|---|
| `StartPage` | page | Home page: inline hero + content area (Hero / Text / CTA) |
| `ArticlePage` | page | Heading, intro, image, rich-text body, date |
| `Hero` | component | Block, Visual Builder **section** and **element** |
| `TextBlock` | component | Rich text, Visual Builder element |
| `CallToAction` | component | Button, Visual Builder element |
| `BlankExperience` / `BlankSection` | built-in | Visual Builder pages (renderers only) |
| `Seo` | contract | `metaTitle` / `metaDescription` on both page types → `<head>` |

To add a type: create `src/components/MyThing.tsx` exporting `contentType({...})` plus a default React component, register both in `src/lib/optimizely.ts`, then run `npm run cms:push`.

---

## 1. Get credentials from the CMS

In your CMS (`https://<instance>.cms.optimizely.com`) → **Settings → API Keys**:

| What | Where | Env var | Needed on Vercel? |
|---|---|---|---|
| Graph **Single Key** | *Render Content* section | `OPTIMIZELY_GRAPH_SINGLE_KEY` | Yes |
| Graph **AppKey** + **Secret** | *Manage Graph* section | `OPTIMIZELY_GRAPH_APP_KEY`, `OPTIMIZELY_GRAPH_SECRET` | No (webhook script only) |
| CMS API client | **Create API key** → copy Client ID / Secret | `OPTIMIZELY_CMS_CLIENT_ID`, `OPTIMIZELY_CMS_CLIENT_SECRET` | No (CLI only) |

```bash
cp .env.example .env      # fill in the values above + OPTIMIZELY_CMS_URL
npm install
```

## 2. Push the content types

```bash
npm run cms:login          # verifies the API client
npm run cms:push:dry       # optional: validate the model without changing anything
npm run cms:push           # creates StartPage, ArticlePage, Hero, TextBlock, CallToAction, Seo
```

Re-run `npm run cms:push` whenever you change a content type in code.

## 3. Create the start page and application

1. **Create content** → type **Start page** → name it "Home". Fill the hero, add a block or two, **Publish**.
2. **Settings → Applications → Create Application** → name it (e.g. `website`) → start page **From existing → Home** → **Create**.
3. With the default settings the start page URL is `/en/` and children are `/en/<name-in-url>/`. The app serves `/` as the start page using `DEFAULT_LOCALE`.

## 4. Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket) and **Import** it in Vercel. Framework preset: **Next.js**; no build settings to change.
2. **Settings → Environment Variables** (Production + Preview):

   | Variable | Value |
   |---|---|
   | `OPTIMIZELY_CMS_URL` | `https://<instance>.cms.optimizely.com` |
   | `OPTIMIZELY_GRAPH_SINGLE_KEY` | Single Key from step 1 |
   | `DEFAULT_LOCALE` | `en` |
   | `REVALIDATE_SECRET` | long random string (`openssl rand -hex 24`) |
   | `APPLICATION_HOST` | *optional*, only for multi-site, e.g. `https://www.example.com` |

3. Deploy, then open `https://<project>.vercel.app/` — you should see the Home page.

> **Vercel Deployment Protection:** preview deployments (`*-git-*.vercel.app`) are protected by Vercel Authentication by default, which blocks both the CMS iframe and the Graph webhook. Point the CMS at your **production** domain (public by default), or use a custom domain. If you must preview against a protected deployment, configure *Protection Bypass for Automation* in Vercel.

## 5. Enable live preview and on-page editing

In the CMS → **Settings → Applications → (your app)**:

1. **Hostnames → Add Hostname**
   - `<project>.vercel.app` (or your custom domain), **Use a secure connection (HTTPS)** checked, Locale: all.
   - Optional for local dev: `localhost:3000` with HTTPS checked (see *Local development*).
2. **Live Preview** tab
   - Select **Use Preview Tokens**.
   - Under **Preview URL format** click **Enabled**. Set the format to
     `{host}/preview?key={key}&ver={version}&loc={locale}&ctx={context}`
     (the CMS appends `preview_token` itself).
   - **Save**.
3. Open Home in the CMS editor. The right-hand panel now shows your Vercel site; edits appear as you type, and clicking a field highlighted on the page jumps to it in the editor.

**Visual Builder:** create content → **Blank Experience** under Home. Add a *Blank section* (rows/columns) or a *Hero* section, then drop *Hero*, *Text* or *Call to action* elements into it.

How preview works in code: `src/app/preview/page.tsx` calls `getPreviewContent()` with the token from the URL, loads `communicationinjector.js` from your CMS, and mounts `NextPreviewComponent`, which refreshes the page when the editor saves. `next.config.ts` sends `Content-Security-Policy: frame-ancestors <OPTIMIZELY_CMS_URL>` so only your CMS can frame `/preview`. Components mark editable fields with `pa('propertyName')` from `getPreviewUtils()`.

## 6. Purge the cache on publish (Graph webhook)

Published pages are cached on Vercel and refreshed at least every 5 minutes (`revalidate = 300`). For changes to appear right after publishing, register the webhook once:

```bash
# in .env: OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET, REVALIDATE_SECRET (same as Vercel), SITE_URL
SITE_URL=https://<project>.vercel.app npm run webhook:create
npm run webhook:list     # check it exists
```

Graph then calls `POST /api/revalidate/<REVALIDATE_SECRET>` after each publish. The handler looks up the page's URL and purges it. Deletes, bulk syncs and unknown events purge the whole site. A wrong secret returns 404.

## Local development

```bash
npm run dev     # https://localhost:3000 (self-signed cert via --experimental-https)
```

Then open `https://localhost:3000/en/`. HTTPS matters: the CMS runs on HTTPS and browsers won't frame an `http://` preview. To preview against your laptop, add the `localhost:3000` hostname (step 5), and accept the self-signed certificate once by opening `https://localhost:3000` directly in the same browser.

## Project layout

```
optimizely.config.mjs          CLI config: where content types live, property groups
src/lib/optimizely.ts          SDK config + content type and React component registries
src/lib/content.ts             path mapping + cached getContentByPath
src/app/[[...slug]]/page.tsx   published pages (ISR) + <head> metadata from the Seo contract
src/app/preview/page.tsx       live preview / on-page editing
src/app/api/revalidate/[secret]/route.ts   Graph webhook → revalidatePath
src/components/*.tsx           content types and their React renderers
scripts/create-webhook.mjs     registers / lists the Graph webhook
```

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| 404 on `/` | Start page not published, wrong `DEFAULT_LOCALE`, or `APPLICATION_HOST` doesn't match the hostname configured in the CMS |
| 500 / `HTTP 401` from Graph | `OPTIMIZELY_GRAPH_SINGLE_KEY` missing or wrong in Vercel (redeploy after changing env vars) |
| Preview pane blank / "refused to connect" | Hostname missing in the application, Vercel Deployment Protection, `OPTIMIZELY_CMS_URL` doesn't exactly match the CMS origin, or http instead of https |
| Preview loads but doesn't update while typing | `communicationinjector.js` blocked (check console) or **Use Preview Tokens** not enabled |
| `config push` fails with unconstrained property | Every `content`/`contentReference` property needs `allowedTypes`, `restrictedTypes` or `contentType` |
| A block or element renders nothing | Its `key` isn't registered in `src/lib/optimizely.ts` (both registries) |
| Changes need minutes to appear | Webhook not registered, or `REVALIDATE_SECRET` differs between `.env` and Vercel |

## References

- SDK docs: <https://github.com/episerver/content-js-sdk/tree/main/docs>
- Live preview: <https://docs.developers.optimizely.com/content-management-system/v1.0.0-CMS-SaaS/docs/enable-live-preview-saas>
- Graph webhooks: <https://docs.developers.optimizely.com/platform-optimizely/reference/create-webhookhandler>
