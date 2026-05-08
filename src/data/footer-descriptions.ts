/**
 * Per-page footer descriptions.
 *
 * Each key is a URL pathname. The Footer component looks up the current page
 * and renders the matching copy. Unmapped pages fall back to the default.
 *
 * Keep descriptions short — one to two sentences max.
 */

export const DEFAULT_FOOTER_DESCRIPTION =
  'DJ Misha is a San Diego DJ for hire, specializing in weddings, parties, and corporate events, with expertise in EDM, house, and dance music. Mobile DJ services include sound systems and professional DJ gear.';

export const footerDescriptions: Record<string, string> = {
  '/': DEFAULT_FOOTER_DESCRIPTION,

  '/about/':
    'DJ Misha brings over 15 years of experience reading crowds and creating unforgettable moments at San Diego events.',

  '/services/':
    'From weddings to corporate galas to private parties, DJ Misha offers tailored DJ packages with professional sound and lighting.',

  '/services/wedding-dj-in-san-diego/':
    'San Diego wedding DJ services — ceremony music, cocktail hour, dinner, and a dance floor that stays packed all night.',

  '/services/destination-wedding-dj/':
    'Destination wedding DJ services for couples planning celebrations beyond San Diego — professional sound wherever you say "I do."',

  '/services/corporate-event-dj-in-san-diego/':
    'Corporate event DJ in San Diego — polished, professional music and MC services for galas, holiday parties, and company celebrations.',

  '/services/party-birthday-dj-in-san-diego/':
    'Party and birthday DJ in San Diego — high-energy sets, custom playlists, and a sound system that turns any venue into a dance floor.',

  '/dj-saxophone/':
    'Live saxophone paired with DJ sets for a unique, high-energy performance perfect for weddings, cocktail hours, and special events.',

  '/music/':
    'Listen to DJ Misha mixes spanning house, EDM, dance, and Top 40 — a preview of what your event could sound like.',

  '/reviews/':
    'See why clients rate DJ Misha 5 stars — real reviews from weddings, parties, and corporate events across San Diego.',

  '/contact/':
    'Get in touch with DJ Misha for a fast quote. Available for weddings, parties, and events in San Diego and beyond.',

  '/blog/':
    'DJ tips, wedding planning advice, and behind-the-scenes insights from a working San Diego DJ.',

  '/blog/your-wedding-your-music-how-i-spin-a-dj-set-tailored-to-your-vision/':
    'How DJ Misha builds a custom wedding set list around your music taste, timeline, and vision for the big day.',

  '/blog/crafting-the-perfect-toast-dj-tips-for-a-memorable-wedding-speech/':
    'Practical tips from a wedding DJ on delivering a toast that lands — timing, mic technique, and keeping it memorable.',

  '/blog/the-art-of-taking-requests-a-djs-perspective/':
    'How a professional DJ handles song requests — balancing crowd energy, client preferences, and the flow of the night.',

  '/blog/a-guide-to-planning-for-your-wedding-with-dj-misha/':
    'A step-by-step guide to planning your wedding music — from the first consultation to the last dance.',

  '/blog/edm-dj-for-party-or-private-event-electronic-dance-music/':
    'Bring the energy of a live EDM set to your private event — house, dance, and electronic music tailored to your crowd.',

  '/blog/prices-rates-and-average-cost-for-hiring-a-dj/':
    'What does a DJ cost? A breakdown of average rates, what affects pricing, and what to expect when hiring a San Diego DJ.',
};
