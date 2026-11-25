import { initializeFooterFancybox } from './footer-fancybox.js';
import { initializeMain } from './main.js';
import { initializeSiteCta } from './site-cta.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    initializeMain();
    initializeSiteCta();
    initializeFooterFancybox();
  },
  { once: true },
);
