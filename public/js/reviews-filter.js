/**
 * Client-side keyword filtering for review cards.
 * Single-select pill behavior matching Google Maps UX.
 */
(function () {
  'use strict';

  var pills = document.querySelectorAll('.keyword-pill');
  var cards = document.querySelectorAll('.review-card');
  var grid = document.querySelector('.reviews-grid');

  if (!pills.length || !cards.length || !grid) return;
  var originalCards = Array.prototype.slice.call(cards);

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var keyword = pill.getAttribute('data-keyword');

      // Deactivate all pills, activate clicked one
      pills.forEach(function (p) {
        p.classList.remove('active');
      });
      pill.classList.add('active');

      if (keyword === 'all') {
        originalCards.forEach(function (card) {
          card.classList.remove('review-card-hidden');
          grid.appendChild(card);
        });
        return;
      }

      var matchingCards = originalCards.filter(function (card) {
        var cardKeywords = (card.getAttribute('data-keywords') || '').split(
          ',',
        );
        return cardKeywords.indexOf(keyword) !== -1;
      });
      matchingCards.sort(function (a, b) {
        return (
          Number(b.getAttribute('data-review-time')) -
          Number(a.getAttribute('data-review-time'))
        );
      });
      var matchingSet = new Set(matchingCards);

      matchingCards.forEach(function (card) {
        card.classList.remove('review-card-hidden');
        grid.appendChild(card);
      });
      originalCards.forEach(function (card) {
        if (matchingSet.has(card)) return;
        card.classList.add('review-card-hidden');
        grid.appendChild(card);
      });
    });
  });
})();
