/**
 * Client-side keyword filtering for review cards.
 * Single-select pill behavior matching Google Maps UX.
 */
(function () {
  'use strict';

  var pills = document.querySelectorAll('.keyword-pill');
  var cards = document.querySelectorAll('.review-card');

  if (!pills.length || !cards.length) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var keyword = pill.getAttribute('data-keyword');

      // Deactivate all pills, activate clicked one
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');

      // Filter cards
      cards.forEach(function (card) {
        if (keyword === 'all') {
          card.classList.remove('review-card-hidden');
        } else {
          var cardKeywords = (card.getAttribute('data-keywords') || '').split(',');
          if (cardKeywords.indexOf(keyword) !== -1) {
            card.classList.remove('review-card-hidden');
          } else {
            card.classList.add('review-card-hidden');
          }
        }
      });
    });
  });
})();
