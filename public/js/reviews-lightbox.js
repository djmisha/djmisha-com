/**
 * Reviews grid: show "View more" only when clamped text overflows,
 * and open the full testimonial in the existing Fancybox gallery.
 */
(function () {
  'use strict';

  var cards = document.querySelectorAll('.review-card');
  var pills = document.querySelectorAll('.keyword-pill');
  var scheduled = false;

  function textOverflows(text) {
    if (text.scrollHeight > text.clientHeight + 1) return true;

    var clone = text.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.display = 'block';
    clone.style.webkitLineClamp = 'unset';
    clone.style.lineClamp = 'unset';
    clone.style.webkitBoxOrient = 'unset';
    clone.style.overflow = 'visible';
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.width = text.clientWidth + 'px';
    text.parentNode.appendChild(clone);
    var overflows = clone.scrollHeight > text.clientHeight + 1;
    clone.remove();
    return overflows;
  }

  function updateOverflow() {
    scheduled = false;
    cards.forEach(function (card) {
      var text = card.querySelector('.review-text');
      if (
        card.classList.contains('review-card-hidden') ||
        (text && text.clientWidth === 0)
      ) {
        return;
      }

      card.classList.add('review-card--measured');
      card.classList.toggle(
        'review-card--overflow',
        !!(text && textOverflows(text)),
      );
    });
  }

  function scheduleOverflow() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateOverflow);
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (event) {
      if (event.target.closest('a, button')) return;
      var selection = window.getSelection && window.getSelection();
      if (selection && String(selection).length) return;
      var link = card.querySelector('.review-view-more');
      if (link) link.click();
    });
  });

  pills.forEach(function (pill) {
    pill.addEventListener('click', scheduleOverflow);
  });

  window.addEventListener('resize', scheduleOverflow);

  if (window.ResizeObserver) {
    var grid = document.querySelector('.reviews-grid');
    if (grid) new ResizeObserver(scheduleOverflow).observe(grid);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleOverflow);
  }

  updateOverflow();

  // Fancybox 3 treats modern Chrome as non-mobile (document.createTouch is
  // gone), then preventDefault() on touchstart blocks scrolling. Keep
  // vertical pans native inside the review panel and turn horizontal pans
  // into next/previous for this gallery only.
  var reviewGesture = null;

  document.addEventListener(
    'touchstart',
    function (event) {
      var scroll =
        event.target.closest &&
        event.target.closest('.review-lightbox__scroll');
      if (!scroll || event.touches.length !== 1) {
        reviewGesture = null;
        return;
      }
      reviewGesture = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        axis: '',
      };
      event.stopPropagation();
    },
    true,
  );

  document.addEventListener(
    'touchmove',
    function (event) {
      if (!reviewGesture || !event.touches.length) return;
      var dx = event.touches[0].clientX - reviewGesture.x;
      var dy = event.touches[0].clientY - reviewGesture.y;
      if (!reviewGesture.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        reviewGesture.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      event.stopPropagation();
      if (reviewGesture.axis === 'x') event.preventDefault();
    },
    { capture: true, passive: false },
  );

  document.addEventListener(
    'touchend',
    function (event) {
      if (!reviewGesture) return;
      var touch = event.changedTouches[0];
      var dx = touch.clientX - reviewGesture.x;
      var dy = touch.clientY - reviewGesture.y;
      var axis = reviewGesture.axis;
      reviewGesture = null;
      event.stopPropagation();
      if (
        axis === 'x' &&
        Math.abs(dx) > 48 &&
        Math.abs(dx) > Math.abs(dy) &&
        window.jQuery &&
        jQuery.fancybox
      ) {
        var instance = jQuery.fancybox.getInstance();
        if (!instance) return;
        if (dx < 0) instance.next();
        else instance.previous();
      }
    },
    true,
  );

  function fitReviewPanel(current) {
    if (!current || !current.$slide || !current.$content) return;
    var slide = current.$slide.get(0);
    if (!slide) return;
    var styles = window.getComputedStyle(slide);
    var padX =
      (parseFloat(styles.paddingLeft) || 0) +
      (parseFloat(styles.paddingRight) || 0);
    var padY =
      (parseFloat(styles.paddingTop) || 0) +
      (parseFloat(styles.paddingBottom) || 0);
    var width = Math.floor(slide.clientWidth - padX);
    var height = Math.floor(slide.clientHeight - padY);
    if (width < 1 || height < 1) return;
    current.$content.css({
      width: width + 'px',
      height: height + 'px',
    });
  }

  function initFancybox() {
    if (!window.jQuery || !jQuery.fn.fancybox) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    jQuery('[data-fancybox="reviews"]').fancybox({
      loop: false,
      margin: [44, 0],
      gutter: 40,
      keyboard: true,
      arrows: true,
      infobar: false,
      toolbar: true,
      smallBtn: false,
      buttons: ['close'],
      idleTime: false,
      protect: false,
      modal: false,
      hash: false,
      animationEffect: reduce ? false : 'fade',
      animationDuration: reduce ? 0 : 300,
      transitionEffect: reduce ? false : 'fade',
      transitionDuration: reduce ? 0 : 300,
      slideClass: 'review-fancybox-slide',
      baseClass: 'review-fancybox',
      touch: {
        vertical: true,
        momentum: true,
      },
      clickContent: false,
      clickSlide: false,
      clickOutside: 'close',
      wheel: false,
      afterShow: function (_instance, current) {
        fitReviewPanel(current);
        var scroller = current.$content
          .find('.review-lightbox__scroll')
          .get(0);
        if (scroller) scroller.scrollTop = 0;
      },
      onUpdate: function (_instance, current) {
        fitReviewPanel(current);
      },
    });
  }

  if (window.jQuery) {
    jQuery(initFancybox);
  } else {
    window.addEventListener('DOMContentLoaded', initFancybox);
  }
})();
