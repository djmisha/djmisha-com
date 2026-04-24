# Navigation Structure

Reference document for the DJ Misha website navigation menus.

## Primary Navigation (Header)

Located in `src/components/Navigation.astro` (migrated from WordPress `wp_nav_menu` with `theme_location: primary` in `navigation.php`).

| Label | Path | Notes |
|-------|------|-------|
| Home | `/` | |
| About | `/about/` | |
| Music | `/music/` | |
| Reviews | `/reviews/` | |
| Prices | `/prices/` | |
| Services | `/services/` | Dropdown parent |
| ↳ DJ + Saxophone | `/dj-saxophone/` | Dropdown child |
| ↳ Wedding DJ | `/services/wedding-dj-in-san-diego/` | Dropdown child |
| ↳ Destination Wedding DJ | `/services/destination-wedding-dj/` | Dropdown child |
| ↳ Corporate Event DJ | `/services/corporate-event-dj-in-san-diego/` | Dropdown child |
| ↳ Party & Birthday DJ | `/services/party-birthday-dj-in-san-diego/` | Dropdown child |
| Contact | `/contact/` | Styled as primary button |

## Footer Navigation

Located in `src/components/Footer.astro` (migrated from WordPress `wp_nav_menu` with `theme_location: footer` and `theme_location: services`).

### Footer Menu (left column)

| Label | Path |
|-------|------|
| Home | `/` |
| About | `/about/` |
| Music | `/music/` |
| Reviews | `/reviews/` |
| Prices | `/prices/` |
| Contact | `/contact/` |

### Services Menu (center column)

| Label | Path |
|-------|------|
| DJ Services | `/services/` |
| DJ + Saxophone | `/dj-saxophone/` |
| Wedding DJ in San Diego | `/services/wedding-dj-in-san-diego/` |
| Destination Wedding DJ | `/services/destination-wedding-dj/` |
| Corporate Event DJ in San Diego | `/services/corporate-event-dj-in-san-diego/` |
| Party Birthday DJ in San Diego | `/services/party-birthday-dj-in-san-diego/` |

## Footer Social Links

| Platform | URL |
|----------|-----|
| Instagram | https://www.instagram.com/djmishasd/ |
| Google Maps | Google Maps listing |
| Yelp | https://www.yelp.com/biz/dj-misha-san-diego-3 |
| Facebook | https://www.facebook.com/djmishaSandiego |
| Email/Contact | `/contact/` |

## Footer Utility Links

- Sitemap: `/sitemap/`
- "Book Now, Let's Chat" floating CTA → `/contact/`

## Additional Pages (not in menus)

| Page | Path | Template |
|------|------|----------|
| Blog listing | `/blog/` | Linked from homepage "More from our Blog" button |
| Photo Gallery | `/photogallery/` | |
| DJ Misha bio | `/misha/` | |

## WordPress Menu Registrations (original)

From `functions.php`, three menus were registered:
- `primary` — Header nav
- `footer` — Footer left column
- `services` — Footer center column
