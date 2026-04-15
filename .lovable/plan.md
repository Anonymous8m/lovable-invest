

## Problem: Blank Page on Netlify

Two issues cause a blank page when deploying a Lovable project to Netlify:

1. **SPA Routing** — Netlify doesn't know to serve `index.html` for all routes, so any path other than `/` returns a 404. A `public/_redirects` file fixes this.

2. **`lovable-tagger` plugin** — The `componentTagger()` runs in development mode. On Netlify, `NODE_ENV` may not be set to `production`, causing this dev-only plugin to run and potentially break the build or runtime.

## Plan

### 1. Add `public/_redirects` for Netlify SPA routing
Create `public/_redirects` with:
```
/*    /index.html   200
```

### 2. Verify build works
The build command is `vite build` which should work on Netlify with:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 3. Netlify environment variables
Ensure these env vars are set in Netlify's dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Without these, the Supabase client will fail silently, causing a blank page.

---

**Note:** Lovable's own hosting handles all of this automatically. If you publish via Lovable (click Publish in the editor), you won't need any of these workarounds. But if you prefer Netlify, the steps above will fix the blank page.

