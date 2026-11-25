function attachWeddingVideo() {
  const videoContainer = document.querySelector('.wedding-dj-video');
  if (!videoContainer) return;

  if (window.innerWidth >= 768) return;

  videoContainer.innerHTML =
    '<video playsinline autoplay muted loop poster="/images/dj-service-wedding.jpg"><source src="https://grooverooster.com/images/djmisha/wedding-dj.mp4" type="video/mp4"></video>';
  document.querySelector('.wedding-dj-image')?.remove();
}

function detectScrollForWeddingVideo() {
  if (window.scrollY <= 3860) return;
  attachWeddingVideo();
  window.removeEventListener('scroll', detectScrollForWeddingVideo);
}

window.addEventListener('scroll', detectScrollForWeddingVideo);
