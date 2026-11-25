export function initializeFooterFancybox() {
  const $ = window.jQuery;
  if (!$?.fn.fancybox) {
    throw new Error('Fancybox did not load before its initializer');
  }

  const images = $('a').filter(function () {
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test($(this).attr('href'));
  });
  const gallery = $('.ngg-gallery-thumbnail a');
  images.each(function () {
    const title = $(this).children('img').attr('title');
    const caption = $(this).children('img').attr('alt');
    $(this)
      .attr('data-fancybox', '')
      .attr('title', title)
      .attr('data-caption', caption);
  });
  gallery.each(function () {
    const galleryId =
      $(this).closest('.ngg-galleryoverview').attr('id') || 'gallery';
    const title = $(this).children('img').attr('title');
    const caption = $(this).children('img').attr('alt');
    $(this)
      .attr('data-fancybox', galleryId)
      .attr('title', title)
      .attr('data-caption', caption);
  });

  $('[data-fancybox]').fancybox({
    loop: false,
    margin: [44, 0],
    gutter: 50,
    keyboard: true,
    arrows: true,
    infobar: false,
    toolbar: true,
    buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],
    idleTime: 4,
    protect: false,
    modal: false,
    animationEffect: 'zoom',
    animationDuration: 350,
    transitionEffect: 'fade',
    transitionDuration: 350,
  });
}
