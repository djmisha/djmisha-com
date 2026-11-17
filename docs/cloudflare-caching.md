# Cloudflare caching

HTML on djmisha.com is cached at Cloudflare's edge for one day. The rules in `cloudflare/cache-rules.json` are the zone's `http_request_cache_settings` entrypoint (zone id `f1f41a54923e1ec1c62276e515c393ed`). Cache Rules stack: when several rules match, the last matching rule wins for each setting they both set.

## Rules

1. **Static assets.** Requests whose extension is `css`, `js`, `mjs`, `jpg`, `jpeg`, `png`, `gif`, `webp`, `avif`, `svg`, `ico`, `woff`, `woff2`, `ttf`, `otf`, `eot`, `mp3`, `mp4`, `webm`, `pdf`, `txt`, `xml`, or `webmanifest` are cached at the edge for 30 days. The browser TTL follows the origin `Expires` and `Cache-Control` headers.

2. **`/_astro/` fingerprinted files.** Astro content-hashes these build files. They are cached for 1 year at the edge and in the browser.

3. **HTML.** Paths that end in `/`, use an `html` extension, or have no extension are cached at the edge for 1 day. Browsers recheck after 10 minutes. Responses with status 400–599 are not cached. Each deploy purges this edge copy.

4. **PHP.** Paths under `/php/` and any path with a `php` extension are never cached, including the form handlers.

`public/.htaccess` sets `ExpiresByType text/html` to 10 minutes. HTML previously matched `ExpiresDefault` (2 days). Cloudflare keeps an origin `max-age` when that value is longer than the browser TTL on a cache rule, so the origin header has to be 10 minutes for browsers to recheck on that schedule.

## Purge on deploy

The last step in `.github/workflows/deploy.yml` runs after the FTP upload. It POSTs `{"purge_everything":true}` to `https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache`. The site is small and `/_astro/` filenames change with their contents, so purging everything is the simplest way to drop stale HTML at the edge.

`CLOUDFLARE_ZONE_ID` is set on that step. `CLOUDFLARE_API_TOKEN` is the repository secret. When the secret is empty, the step prints a `::warning::` and exits successfully so deploys finish before the secret exists. Otherwise the step uses `curl --fail-with-body` and fails unless the JSON `success` field is true.

## Token

Store a Cloudflare API token as the `CLOUDFLARE_API_TOKEN` repository secret. Scope it to the djmisha.com zone and grant only the Cache Purge permission.

## Re-apply the rules

A separate token with Cache Rules Edit can put this file back onto the entrypoint. From the repository root:

```bash
curl -X PUT https://api.cloudflare.com/client/v4/zones/<zone>/rulesets/phases/http_request_cache_settings/entrypoint -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data @cloudflare/cache-rules.json
```

Replace `<zone>` with `f1f41a54923e1ec1c62276e515c393ed`.
