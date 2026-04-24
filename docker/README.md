# Local PHP Testing with Docker

Test the contact form PHP backend locally using Docker.

## Prerequisites

- Docker Desktop installed and running

## How It Works

The Docker setup runs Apache + PHP 8.3, serving:
- `dist/` (Astro build output) as the web root
- `php/` mounted at `/var/www/html/php` so form POSTs resolve to the processor

## Steps

### 1. Build the Astro site

```bash
npm run build
```

### 2. Update PHP config for local testing

In `php/process-form.php`, temporarily change:

```php
$ALLOWED_ORIGIN = 'http://localhost:8080';
```

For reCAPTCHA, either:
- Register a test site key at https://www.google.com/recaptcha/admin with `localhost` as the domain, then update the keys in `php/process-form.php` and `src/components/ContactForm.astro`
- Or comment out the reCAPTCHA verification block in `php/process-form.php` (steps 5a–5c) for quick local testing

### 3. Start the container

```bash
docker compose up --build
```

### 4. Open the form

Visit http://localhost:8080/contact/ in your browser.

### 5. Iterate

- PHP file changes are reflected immediately (just refresh the page)
- Astro/HTML/CSS/JS changes require re-running `npm run build`, then refresh

### 6. Stop the container

```bash
docker compose down
```

### 7. Revert before deploying

Change `$ALLOWED_ORIGIN` back to `'https://djmisha.com'` and restore your production reCAPTCHA keys.

## Notes

- All emails sent by `mail()` are captured by MailHog. View them at http://localhost:8025 — no real emails are sent.
- The honeypot and timing checks work normally in the container.
- The CSRF check validates against `$ALLOWED_ORIGIN`, so make sure it matches `http://localhost:8080` during local testing.
